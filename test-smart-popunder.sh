#!/bin/bash

echo "=== Smart Popunder Testing Script ==="
echo ""

DOMAIN="bokepindonesia.my.id"
echo "Testing Smart Popunder on: $DOMAIN"
echo ""

# Test conditions
echo "🎯 Testing Popunder Trigger Conditions:"
echo ""

echo "1. First Visit Test:"
echo "   - Clear localStorage and visit homepage"
echo "   - Should trigger popunder after 2 seconds"
echo "   - Check localStorage: first_visit = true"
echo ""

echo "2. Play Button Click Test:"
echo "   - Visit any video page"
echo "   - Click play button"
echo "   - Should trigger popunder immediately"
echo "   - Check localStorage: play_click_count >= 1"
echo ""

echo "3. Thumbnail Click Test:"
echo "   - Visit homepage or category page"
echo "   - Click any video thumbnail"
echo "   - Should trigger popunder immediately"
echo "   - Check localStorage: thumbnail_click_count >= 1"
echo ""

echo "4. Rate Limiting Test:"
echo "   - Trigger popunder once"
echo "   - Try to trigger again immediately"
echo "   - Should NOT trigger (rate limited)"
echo "   - Check localStorage: last_popunder_time set"
echo ""

echo "5. Reset Test (24 hours):"
echo "   - Wait 24 hours or manually set last_popunder_time to old"
echo "   - Should be able to trigger again"
echo "   - Check localStorage: counters reset to 0"
echo ""

# Test website
echo "🌐 Testing Website Accessibility:"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN")
echo "Website HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Website accessible"
    
    echo ""
    echo "📄 Checking Smart Popunder Implementation..."
    
    # Get page source and check for smart popunder
    PAGE_SOURCE=$(curl -s "https://$DOMAIN" | head -c 10000)
    
    if echo "$PAGE_SOURCE" | grep -q "SmartPopunder"; then
        echo "✅ SmartPopunder component found in page"
    else
        echo "❌ SmartPopunder component not found in page"
    fi
    
    if echo "$PAGE_SOURCE" | grep -q "4388c91d89682a21f68164b288c042f9"; then
        echo "✅ Popunder script URL found in page"
    else
        echo "❌ Popunder script URL not found in page"
    fi
    
    if echo "$PAGE_SOURCE" | grep -q "data-video-card"; then
        echo "✅ Video card tracking attributes found"
    else
        echo "❌ Video card tracking attributes not found"
    fi
    
else
    echo "❌ Website not accessible (HTTP $HTTP_CODE)"
fi

echo ""
echo "🧪 Manual Testing Instructions:"
echo ""
echo "1. Open browser and go to https://$DOMAIN"
echo "2. Open Developer Tools (F12)"
echo "3. Go to Console tab"
echo "4. Clear localStorage:"
echo "   localStorage.clear()"
echo ""
echo "5. Test First Visit:"
echo "   - Refresh page"
echo "   - Check console for 'Popunder triggered successfully'"
echo "   - Check localStorage: localStorage.getItem('first_visit')"
echo ""
echo "6. Test Play Button:"
echo "   - Go to any video page"
echo "   - Click play button"
echo "   - Check console for popunder message"
echo "   - Check localStorage: localStorage.getItem('play_click_count')"
echo ""
echo "7. Test Thumbnail Click:"
echo "   - Go to homepage"
echo "   - Click any video thumbnail"
echo "   - Check console for popunder message"
echo "   - Check localStorage: localStorage.getItem('thumbnail_click_count')"
echo ""
echo "8. Test Rate Limiting:"
echo "   - Trigger popunder once"
echo "   - Try to trigger again immediately"
echo "   - Should not trigger (check console)"
echo "   - Check localStorage: localStorage.getItem('last_popunder_time')"
echo ""

echo "📊 Expected localStorage Values:"
echo ""
echo "Before any trigger:"
echo "- first_visit: 'false' or null"
echo "- play_click_count: '0' or null"
echo "- thumbnail_click_count: '0' or null"
echo "- last_popunder_time: null or old timestamp"
echo ""
echo "After first visit trigger:"
echo "- first_visit: 'true'"
echo "- last_popunder_time: [current timestamp]"
echo ""
echo "After play button click:"
echo "- play_click_count: '1'"
echo "- last_popunder_time: [current timestamp]"
echo ""
echo "After thumbnail click:"
echo "- thumbnail_click_count: '1'"
echo "- last_popunder_time: [current timestamp]"
echo ""

echo "🔍 Debug Console Logs to Look For:"
echo ""
echo "✅ Success:"
echo "- 'Popunder triggered successfully'"
echo "- 'Popunder script loaded'"
echo "- 'Play button clicked: X'"
echo "- 'Thumbnail clicked: X'"
echo "- 'First visit detected, triggering popunder'"
echo ""
echo "❌ Errors:"
echo "- 'Popunder script failed to load'"
echo "- 'Error triggering popunder: ...'"
echo "- 'Adsterra click trigger error: ...'"
echo ""

echo "=== Testing Complete ==="
