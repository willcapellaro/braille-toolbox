#!/bin/bash
# Simple server start script

echo "Starting Depthy server..."
echo ""

# Try Python first (most common)
if command -v python3 &> /dev/null; then
    echo "Using Python HTTP server..."
    cd app && python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "Using Python HTTP server..."
    cd app && python -m http.server 8080
else
    # Fall back to npx http-server
    echo "Using Node.js http-server..."
    npx http-server app -p 8080
fi

