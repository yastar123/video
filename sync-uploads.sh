#!/bin/bash

echo "=== VPS Upload Sync Script ==="
echo ""

# Variables
APP_DIR="/root/video"
NGINX_UPLOAD_DIR="/var/www/video/uploads"

echo "Syncing uploads from app to nginx directory..."
echo "From: $APP_DIR/uploads"
echo "To: $NGINX_UPLOAD_DIR"
echo ""

# Create nginx directory if not exists
mkdir -p "$NGINX_UPLOAD_DIR"

# Sync files from app to nginx directory
if [ -d "$APP_DIR/uploads" ]; then
    echo "Syncing files..."
    rsync -av --chown=www-data:www-data "$APP_DIR/uploads/" "$NGINX_UPLOAD_DIR/"
    echo "✅ Sync completed"
else
    echo "❌ App uploads directory not found: $APP_DIR/uploads"
fi

# Set proper permissions
echo ""
echo "Setting permissions..."
chown -R www-data:www-data "$NGINX_UPLOAD_DIR"
chmod -R 755 "$NGINX_UPLOAD_DIR"
echo "✅ Permissions set"

# Show results
echo ""
echo "Sync Results:"
echo "Files in nginx directory: $(find $NGINX_UPLOAD_DIR -type f | wc -l)"
echo "Total size: $(du -sh $NGINX_UPLOAD_DIR 2>/dev/null | cut -f1 || echo 'Unknown')"

# List recent files
echo ""
echo "Recent files in nginx directory:"
ls -la "$NGINX_UPLOAD_DIR" | head -10

echo ""
echo "=== Sync Complete ==="
