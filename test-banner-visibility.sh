#!/bin/bash

echo "=== Adsterra Banner Visibility Testing Script ==="
echo ""

DOMAIN="bokepindonesia.my.id"
echo "Testing domain: $DOMAIN"
echo ""

echo "🔍 Testing Adsterra Banner Issues..."
echo ""

# Test website accessibility
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN")
echo "Website HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Website accessible"
    
    echo ""
    echo "📄 Checking Banner Implementation..."
    
    # Get page source and check for ad implementations
    PAGE_SOURCE=$(curl -s "https://$DOMAIN" | head -c 20000)
    
    echo "Checking for Adsterra components:"
    
    if echo "$PAGE_SOURCE" | grep -q "AdsterraBanner"; then
        echo "✅ AdsterraBanner component found"
    else
        echo "❌ AdsterraBanner component not found"
    fi
    
    if echo "$PAGE_SOURCE" | grep -q "6e9a519272442fa242b5a43e53ddc7fd"; then
        echo "✅ 160x300 ad key found"
    else
        echo "❌ 160x300 ad key not found"
    fi
    
    if echo "$PAGE_SOURCE" | grep -q "5a8dd45e78414c6e5be9db9eaffed61f"; then
        echo "✅ 728x90 ad key found"
    else
        echo "❌ 728x90 ad key not found"
    fi
    
    if echo "$PAGE_SOURCE" | grep -q "c08de902b7930682919199d915646b97"; then
        echo "✅ Native banner key found"
    else
        echo "❌ Native banner key not found"
    fi
    
    echo ""
    echo "🌐 Testing Ad Script URLs..."
    
    # Test individual ad scripts
    echo "1. 160x300 Banner Script:"
    curl -s -I "https://www.highperformanceformat.com/6e9a519272442fa242b5a43e53ddc7fd/invoke.js" | head -1
    
    echo "2. 728x90 Banner Script:"
    curl -s -I "https://www.highperformanceformat.com/5a8dd45e78414c6e5be9db9eaffed61f/invoke.js" | head -1
    
    echo "3. Native Banner Script:"
    curl -s -I "https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js" | head -1
    
    echo "4. Social Bar Script:"
    curl -s -I "https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js" | head -1
    
    echo ""
    echo "🔍 Testing Ad Tracking URLs (from your network log):"
    
    # Test tracking URLs that were requested
    echo "1. Litterarenadisembroildisembroil.com:"
    curl -s -I "https://litterarenadisembroildisembroil.com/" | head -1
    
    echo "2. Test tracking image request:"
    curl -s -I "https://litterarenadisembroildisembroil.com/ren.gif" | head -1
    
else
    echo "❌ Website not accessible (HTTP $HTTP_CODE)"
fi

echo ""
echo "📊 Common Banner Issues & Solutions:"
echo ""
echo "❌ Issue 1: Scripts load but no banner visible"
echo "   Cause: Adsterra may not have ads for your region/traffic"
echo "   Solution: Test with VPN from different countries"
echo ""
echo "❌ Issue 2: Console shows script loaded but no iframe"
echo "   Cause: Container visibility issues or CSS conflicts"
echo "   Solution: Check container dimensions and z-index"
echo ""
echo "❌ Issue 3: Network shows tracking requests but no ads"
echo "   Cause: Ad inventory empty or ad block detected"
echo "   Solution: Disable ad blockers, test different times"
echo ""
echo "❌ Issue 4: Development mode shows debug borders"
echo "   Cause: Component in development mode"
echo "   Solution: Check production environment"
echo ""

echo "🧪 Manual Testing Steps:"
echo ""
echo "1. Open browser and go to https://$DOMAIN"
echo "2. Open Developer Tools (F12)"
echo "3. Go to Console tab"
echo "4. Look for these messages:"
echo "   ✅ 'Loading 160x300 iframe banner...'"
echo "   ✅ 'Adsterra 160x300 script loaded successfully'"
echo "   ✅ '160x300 iframes found: 1'"
echo ""
echo "5. Go to Network tab"
echo "6. Filter by 'invoke.js' and 'ren.gif'"
echo "7. Check if requests are successful (200 OK)"
echo ""
echo "8. Go to Elements tab"
echo "9. Search for 'iframe' elements"
echo "10. Check if ad iframes have content"
echo ""

echo "🔧 Debugging Commands (in browser console):"
echo ""
echo "// Check if ad containers exist:"
echo "document.querySelectorAll('[data-ad-key]').length"
echo ""
echo "// Check if iframes exist:"
echo "document.querySelectorAll('iframe').length"
echo ""
echo "// Check ad container dimensions:"
echo "document.querySelectorAll('.ad-container').forEach(el => {"
echo "  console.log(el.offsetWidth, el.offsetHeight, el.getBoundingClientRect())"
echo "})"
echo ""
echo "// Force reload ads:"
echo "window.location.reload()"
echo ""

echo "🌍 Geographic Testing:"
echo ""
echo "If ads don't show, try with VPN from these countries:"
echo "- United States"
echo "- United Kingdom" 
echo "- Germany"
echo "- France"
echo "- Canada"
echo "- Australia"
echo ""

echo "📈 Expected Behavior:"
echo ""
echo "✅ Working ads should show:"
echo "- Console: 'Loading X banner...'"
echo "- Console: 'Adsterra X script loaded successfully'"
echo "- Console: 'X iframes found: 1'"
echo "- Network: invoke.js requests (200 OK)"
echo "- Network: ren.gif tracking requests (200 OK)"
echo "- Elements: iframe elements with ad content"
echo "- Visible: Actual banner ads on page"
echo ""

echo "❌ Broken ads will show:"
echo "- Console: 'No iframe found for X banner'"
echo "- Console: 'Adsterra X script failed to load'"
echo "- Network: Failed requests"
echo "- Elements: Empty containers or no iframes"
echo "- Invisible: No visible ads"
echo ""

echo "=== Testing Complete ==="
