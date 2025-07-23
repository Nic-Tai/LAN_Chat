const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Trust proxy to get real IP addresses
app.set('trust proxy', true);

// Store messages in memory (in production, you'd use a database)
let messages = [];
let messageIdCounter = 0;

// Load messages from file if it exists
const messagesFile = path.join(__dirname, 'messages.json');
if (fs.existsSync(messagesFile)) {
    try {
        const data = fs.readFileSync(messagesFile, 'utf8');
        messages = JSON.parse(data);
        messageIdCounter = messages.length > 0 ? Math.max(...messages.map(m => m.id)) : 0;
    } catch (error) {
        console.log('Could not load existing messages:', error.message);
    }
}

// Save messages to file
function saveMessages() {
    try {
        fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
    } catch (error) {
        console.log('Could not save messages:', error.message);
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get client IP
app.get('/api/my-ip', (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                    req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
    
    res.json({ ip: clientIP.replace('::ffff:', '') });
});

// Get all messages
app.get('/api/messages', (req, res) => {
    res.json(messages);
});

// Add new message
app.post('/api/messages', (req, res) => {
    const { text } = req.body;
    
    if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Message text is required' });
    }

    // Get client IP address
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                    req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';

    const message = {
        id: ++messageIdCounter,
        text: text.trim(),
        timestamp: new Date().toISOString(),
        senderIP: clientIP.replace('::ffff:', '') // Remove IPv6 prefix if present
    };

    messages.push(message);
    saveMessages();
    
    res.json(message);
});

// Delete all messages (optional endpoint for clearing chat)
app.delete('/api/messages', (req, res) => {
    messages = [];
    messageIdCounter = 0;
    saveMessages();
    res.json({ message: 'All messages deleted' });
});

// Get server info
app.get('/api/info', (req, res) => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    const addresses = [];
    
    for (const name of Object.keys(networkInterfaces)) {
        for (const net of networkInterfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                addresses.push(net.address);
            }
        }
    }
    
    res.json({
        port: PORT,
        addresses: addresses,
        urls: addresses.map(addr => `http://${addr}:${PORT}`)
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    
    console.log('\n🚀 LAN Chat Server Started!');
    console.log('=====================================');
    console.log(`Local: http://localhost:${PORT}`);
    
    // Show all network interfaces
    for (const name of Object.keys(networkInterfaces)) {
        for (const net of networkInterfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                console.log(`LAN:   http://${net.address}:${PORT}`);
            }
        }
    }
    
    console.log('=====================================');
    console.log('Share the LAN URL with other devices on your network!');
    console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down LAN Chat Server...');
    saveMessages();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down LAN Chat Server...');
    saveMessages();
    process.exit(0);
});