#!/bin/bash

echo "=== VPS Next.js + Nginx Setup Script ==="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (sudo)"
    exit 1
fi

echo "✅ Running as root"

# Variables
APP_DIR="/root/video"
NGINX_UPLOAD_DIR="/var/www/video/uploads"
DOMAIN="bokepindonesia.my.id"

echo "App Directory: $APP_DIR"
echo "Nginx Upload Directory: $NGINX_UPLOAD_DIR"
echo "Domain: $DOMAIN"
echo ""

# Create nginx upload directory
echo "Creating nginx upload directory..."
mkdir -p "$NGINX_UPLOAD_DIR"
chown -R www-data:www-data "$NGINX_UPLOAD_DIR"
chmod -R 755 "$NGINX_UPLOAD_DIR"
echo "✅ Created: $NGINX_UPLOAD_DIR"
echo ""

# Create symlink for app to nginx directory (optional)
echo "Creating symlink from app to nginx directory..."
mkdir -p "$APP_DIR/uploads"
ln -sf "$NGINX_UPLOAD_DIR" "$APP_DIR/uploads"
echo "✅ Symlink created: $APP_DIR/uploads -> $NGINX_UPLOAD_DIR"
echo ""

# Set proper permissions
echo "Setting permissions..."
chown -R root:root "$APP_DIR/uploads"
chmod -R 755 "$APP_DIR/uploads"
echo "✅ Permissions set"
echo ""

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t
if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors"
    exit 1
fi
echo ""

# Restart nginx
echo "Restarting nginx..."
systemctl restart nginx
if [ $? -eq 0 ]; then
    echo "✅ Nginx restarted successfully"
else
    echo "❌ Failed to restart nginx"
    exit 1
fi
echo ""

# Restart Next.js app
echo "Restarting Next.js app..."
cd "$APP_DIR"
pm2 restart all
if [ $? -eq 0 ]; then
    echo "✅ Next.js app restarted successfully"
else
    echo "❌ Failed to restart Next.js app"
    exit 1
fi
echo ""

# Test upload directory
echo "Testing upload directory..."
if [ -d "$NGINX_UPLOAD_DIR" ]; then
    echo "✅ Upload directory exists: $NGINX_UPLOAD_DIR"
    echo "   Owner: $(stat -c '%U:%G' $NGINX_UPLOAD_DIR)"
    echo "   Permissions: $(stat -c '%a' $NGINX_UPLOAD_DIR)"
    echo "   Files: $(find $NGINX_UPLOAD_DIR -type f | wc -l)"
else
    echo "❌ Upload directory not found: $NGINX_UPLOAD_DIR"
fi
echo ""

# Create test file
echo "Creating test file..."
TEST_FILE="$NGINX_UPLOAD_DIR/test-upload.txt"
echo "This is a test file for upload verification" > "$TEST_FILE"
chown www-data:www-data "$TEST_FILE"
chmod 644 "$TEST_FILE"
echo "✅ Test file created: $TEST_FILE"
echo ""

# Test URL access
echo "Testing URL access..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost/uploads/test-upload.txt")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Test file accessible via URL: http://localhost/uploads/test-upload.txt"
else
    echo "❌ Test file not accessible (HTTP $HTTP_CODE)"
fi
echo ""

# HTTPS test
echo "Testing HTTPS access..."
HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/uploads/test-upload.txt")
if [ "$HTTPS_CODE" = "200" ]; then
    echo "✅ Test file accessible via HTTPS: https://$DOMAIN/uploads/test-upload.txt"
else
    echo "❌ Test file not accessible via HTTPS (HTTP $HTTPS_CODE)"
fi
echo ""

# Clean up test file
rm -f "$TEST_FILE"
echo "✅ Test file cleaned up"
echo ""

echo "=== Setup Complete ==="
echo ""
echo "Next Steps:"
echo "1. Test file upload via admin panel"
echo "2. Verify files appear in: $NGINX_UPLOAD_DIR"
echo "3. Verify files accessible via: https://$DOMAIN/uploads/[filename]"
echo ""
echo "Debug Commands:"
echo "- Check nginx logs: tail -f /var/log/nginx/error.log"
echo "- Check app logs: pm2 logs"
echo "- Check upload directory: ls -la $NGINX_UPLOAD_DIR"
echo "- Test upload API: curl -X POST -F 'file=@test.jpg' http://localhost:5000/api/uploads/file"
