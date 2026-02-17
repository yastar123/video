#!/bin/bash

echo "=== VPS Deploy and Debug Script ==="
echo ""

# Check if we're on VPS
if [ "$EUID" -eq 0 ]; then
    echo "✅ Running as root (VPS detected)"
    VPS_MODE=true
else
    echo "❌ Not running as root (local mode)"
    VPS_MODE=false
fi

# Environment info
echo "Environment Information:"
echo "- NODE_ENV: $NODE_ENV"
echo "- Current directory: $(pwd)"
echo "- User: $(whoami)"
echo ""

# Check upload directories
echo "Checking upload directories:"
UPLOAD_DIRS=(
    "/root/video/uploads"
    "$(pwd)/uploads"
    "$(pwd)/public/uploads"
    "/tmp/uploads"
    "/var/tmp/uploads"
)

for dir in "${UPLOAD_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir (exists)"
        file_count=$(find "$dir" -type f | wc -l)
        echo "   Files: $file_count"
        if [ $file_count -gt 0 ]; then
            echo "   Recent files:"
            find "$dir" -type f -mtime -1 -exec basename {} \; | head -5 | sed 's/^/     - /'
        fi
    else
        echo "❌ $dir (not exists)"
    fi
    echo ""
done

# Check Next.js process
echo "Checking Next.js process:"
if pgrep -f "next" > /dev/null; then
    echo "✅ Next.js process running"
    echo "   PID: $(pgrep -f next)"
    echo "   Port: $(lsof -i :3000 2>/dev/null | grep LISTEN | awk '{print $9}' || echo 'Not found')"
else
    echo "❌ Next.js process not running"
fi
echo ""

# Check nginx configuration
if [ "$VPS_MODE" = true ]; then
    echo "Checking nginx configuration:"
    if [ -f "/etc/nginx/sites-available/default" ]; then
        echo "✅ Nginx config found"
        echo "   Uploads location:"
        grep -A 5 -B 5 "uploads" /etc/nginx/sites-available/default || echo "   No uploads config found"
    else
        echo "❌ Nginx config not found"
    fi
    echo ""
fi

# Test API endpoints
echo "Testing API endpoints:"
BASE_URL="http://localhost:3000"

# Test upload API
echo "Testing upload API..."
UPLOAD_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/uploads/file")
if [ "$UPLOAD_RESPONSE" = "405" ]; then
    echo "✅ Upload API responding (405 = Method Not Allowed, which is expected for GET)"
else
    echo "❌ Upload API not responding (HTTP $UPLOAD_RESPONSE)"
fi

# Test serve API with a sample file
echo "Testing serve API..."
SAMPLE_FILE="152a9bb6-ae6d-442d-be42-0c3f3a9ca658.png"
SERVE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/uploads/$SAMPLE_FILE")
if [ "$SERVE_RESPONSE" = "200" ]; then
    echo "✅ Serve API working for $SAMPLE_FILE"
elif [ "$SERVE_RESPONSE" = "404" ]; then
    echo "❌ Serve API: File not found ($SAMPLE_FILE)"
    echo "   Checking if file exists in any upload directory..."
    for dir in "${UPLOAD_DIRS[@]}"; do
        if [ -f "$dir/$SAMPLE_FILE" ]; then
            echo "   ✅ Found at: $dir/$SAMPLE_FILE"
        fi
    done
else
    echo "❌ Serve API not responding (HTTP $SERVE_RESPONSE)"
fi
echo ""

# Debug specific file if provided
if [ -n "$1" ]; then
    echo "Debugging specific file: $1"
    for dir in "${UPLOAD_DIRS[@]}"; do
        if [ -f "$dir/$1" ]; then
            echo "✅ Found at: $dir/$1"
            echo "   Size: $(stat -c%s "$dir/$1") bytes"
            echo "   Modified: $(stat -c%y "$dir/$1")"
            echo "   Permissions: $(stat -c%A "$dir/$1")"
        fi
    done
    echo ""
fi

echo "=== End Debug Script ==="
echo ""
echo "Recommendations:"
if [ "$VPS_MODE" = true ]; then
    echo "1. Ensure uploads directory has proper permissions: chmod 755 /root/video/uploads"
    echo "2. Restart Next.js if needed: systemctl restart nextjs"
    echo "3. Check nginx configuration for uploads location"
    echo "4. Verify UPLOAD_DIR environment variable is set correctly"
else
    echo "1. Ensure uploads directory exists in project root"
    echo "2. Check if files are being uploaded to correct location"
    echo "3. Verify serve API is checking correct paths"
fi
