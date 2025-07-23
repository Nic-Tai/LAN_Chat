# LAN Chat

A simple, lightweight chat application for sharing messages between devices on the same Local Area Network (LAN).

## Features

- 💬 Real-time messaging across LAN devices
- 📋 One-click copy to clipboard
- 🎨 Modern, responsive UI
- 💾 Persistent message storage
- 🔄 Auto-sync between devices
- ⌨️ Keyboard shortcuts (Ctrl+Enter to send)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Access the chat:**
   - Local: http://localhost:3000
   - LAN: Use the IP address shown in the terminal (e.g., http://192.168.1.100:3000)

4. **Share with other devices:**
   - Copy the LAN URL from the terminal
   - Open it on any device connected to the same network
   - Start chatting!

## How to Use

1. Type your message in the text area
2. Click "Send" or press Ctrl+Enter
3. Messages appear instantly on all connected devices
4. Click "Copy" button on any message to copy it to clipboard
5. Messages are automatically saved and persist between sessions

## Network Setup

The server automatically detects your network interfaces and displays available URLs. Share the LAN URL (usually starts with 192.168.x.x or 10.x.x.x) with other devices on your network.

## Stopping the Server

Press `Ctrl+C` in the terminal to stop the server. All messages are automatically saved.

## Technical Details

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js with Express
- **Storage:** JSON file (messages.json)
- **Port:** 3000 (configurable in server.js)

## Troubleshooting

- **Can't access from other devices:** Check your firewall settings
- **Messages not syncing:** Ensure all devices are on the same network
- **Server won't start:** Make sure port 3000 is available

Enjoy your simple LAN chat! 🚀