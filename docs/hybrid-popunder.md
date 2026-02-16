# Hybrid Popunder Manager Documentation

## Overview

Hybrid Popunder Manager adalah sistem yang menggabungkan **popunder script** dengan **direct links** untuk maksimalkan revenue dan user engagement. Sistem ini secara cerdas memilih antara popunder atau direct link berdasarkan rasio yang dikonfigurasi.

## Script & Links

### Popunder Script
```html
<script src="https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js"></script>
```

### Direct Links (5 Links)
| ID | URL | Label | Type | Weight | Cooldown |
|----|-----|-------|------|--------|----------|
| `smartlink_1` | `https://www.effectivegatecpm.com/a1pm3et2?key=1bf6eae1539e20a7d049e4876bf00c55` | Premium Content | smartlink | 8 | 30s |
| `smartlink_2` | `https://www.effectivegatecpm.com/k1nsznbwe6?key=4605260c8e2dff4fd591290d334f54c8` | Exclusive Videos | smartlink | 7 | 45s |
| `smartlink_3` | `https://www.effectivegatecpm.com/by96i9ee?key=a0e61301b91f693d8a1866f59dd1de66` | Special Offers | smartlink | 6 | 60s |
| `offer_1` | `https://www.effectivegatecpm.com/a1pm3et2?key=1bf6eae1539e20a7d049e4876bf00c55` | Limited Time Offer | offer | 5 | 90s |
| `content_1` | `https://www.effectivegatecpm.com/k1nsznbwe6?key=4605260c8e2dff4fd591290d334f54c8` | Trending Content | content | 4 | 120s |

## 🎯 **Konfigurasi Aktif (Aggressive Preset)**

```tsx
<HybridPopunder 
  config={{
    ...HYBRID_PRESETS.aggressive,
    enabled: true,
    popunderRatio: 0.6,        // 60% popunder, 40% direct link
    globalCooldown: 2,         // 2 detik global cooldown
    maxPerHour: 100,           // 100 trigger per jam
    maxPerSession: 180,        // 180 trigger per session
    bypassAdBlock: true,
    stealthMode: true,
    mobileOptimized: true,
    fallbackMode: 'both'       // fallback ke keduanya
  }}
/>
```

## ⚖️ **Popunder vs Direct Link Ratio**

### **Current Configuration: 60% Popunder : 40% Direct Link**

#### **Popunder (60%)**
- Script EffectiveGateCPM
- Multiple trigger techniques
- AdBlock bypass
- Stealth mode

#### **Direct Links (40%)**
- 5 smartlink options
- Weighted random selection
- Individual cooldowns
- Floating overlay option

## 🔄 **Trigger Logic**

### **Hybrid Trigger Decision**
```javascript
const shouldUsePopunder = Math.random() < popunderRatio

if (shouldUsePopunder && isScriptLoaded) {
  triggerPopunder()  // 60% chance
} else {
  triggerDirectLink() // 40% chance
}
```

### **Direct Link Selection**
```javascript
// Weighted random selection
const totalWeight = availableLinks.reduce((sum, link) => sum + link.weight, 0)
let random = Math.random() * totalWeight

for (const link of availableLinks) {
  random -= link.weight
  if (random <= 0) return link
}
```

## 🎯 **Trigger Events (17 Events)**

### **Primary Events**
- `click` - Setiap 2 klik
- `contextmenu` - Right click
- `touchstart` - Mobile touch
- `scroll` - 25% scroll depth
- `play` - Media play
- `ended` - Media ended
- `beforeunload` - Page leave
- `exitintent` - Mouse exit viewport

### **Secondary Events**
- `dblclick` - Double click
- `mousedown` - Mouse down
- `touchend` - Touch end
- `wheel` - Mouse wheel
- `focus` - Window focus
- `blur` - Window blur
- `submit` - Form submit
- `pagehide` - Page hide

## 🎨 **Floating Overlay Feature**

### **Auto Floating Overlay**
- Muncul setiap 30 detik (30% chance)
- Muncul saat exit intent jika popunder gagal
- Auto-hilang setelah 10 detik
- Responsive design dengan animasi

### **Overlay Design**
```css
position: fixed;
top: 20px;
right: 20px;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
padding: 12px 20px;
border-radius: 8px;
box-shadow: 0 4px 15px rgba(0,0,0,0.2);
z-index: 9999;
```

### **Overlay Features**
- Pulse animation pada indicator
- Hover effects (scale 1.05)
- Click to trigger direct link
- Auto-remove functionality

## 📊 **Session Management**

### **Tracking Data**
```typescript
interface SessionData {
  sessionCount: number         // Total triggers per session
  hourlyCount: number         // Total triggers per hour
  lastTriggered: number       // Last trigger timestamp
  linkCooldowns: Record<string, number>  // Individual link cooldowns
  triggerStats: {
    popunder: number          // Popunder trigger count
    direct: number            // Direct link trigger count
  }
  lastHourReset: number       // Hour reset timestamp
}
```

### **Cooldown Management**
- **Global Cooldown**: 2 detik untuk semua trigger
- **Link Cooldown**: Individual per direct link (30-120s)
- **Hourly Reset**: Otomatis reset setiap jam
- **Session Persistence**: LocalStorage storage

## 🎛️ **Configuration Presets**

### **Conservative** (80% Popunder : 20% Direct)
```tsx
HYBRID_PRESETS.conservative
```
- popunderRatio: 0.8
- globalCooldown: 5s
- maxPerHour: 30
- maxPerSession: 60

### **Balanced** (70% Popunder : 30% Direct)
```tsx
HYBRID_PRESETS.balanced
```
- popunderRatio: 0.7
- globalCooldown: 3s
- maxPerHour: 50
- maxPerSession: 100

### **Aggressive** (60% Popunder : 40% Direct) - **CURRENT**
```tsx
HYBRID_PRESETS.aggressive
```
- popunderRatio: 0.6
- globalCooldown: 2s
- maxPerHour: 80
- maxPerSession: 150

### **Direct-Focused** (30% Popunder : 70% Direct)
```tsx
HYBRID_PRESETS.direct_focused
```
- popunderRatio: 0.3
- globalCooldown: 2s
- maxPerHour: 100
- maxPerSession: 200

## 🔧 **Advanced Features**

### **Stealth Mode**
```tsx
stealthMode: true
```
- Hidden script attributes
- 2-second delayed loading
- Multiple insertion points
- Anti-detection techniques

### **AdBlock Bypass**
```tsx
bypassAdBlock: true
```
- Script obfuscation
- Fallback loading methods
- Multiple trigger techniques
- Dynamic script injection

### **Fallback Mode**
```tsx
fallbackMode: 'both' // 'popunder' | 'direct' | 'both'
```
- `popunder`: Only popunder fallback
- `direct`: Only direct link fallback
- `both`: Both methods available

### **Mobile Optimization**
```tsx
mobileOptimized: true
```
- Touch event support
- Responsive overlay
- Battery-friendly
- Performance optimized

## 🎯 **Trigger Techniques**

### **Popunder Techniques**
1. **Standard Window.Open**
   ```javascript
   const popunder = window.open('', '_blank', 'width=1,height=1,left=9999,top=9999')
   ```

2. **Form Submission Bypass**
   ```javascript
   const form = document.createElement('form')
   form.method = 'GET'
   form.action = popunderScript
   form.target = '_blank'
   form.submit()
   ```

### **Direct Link Techniques**
1. **New Tab Opening**
   ```javascript
   window.open(link.url, '_blank', 'noopener,noreferrer')
   ```

2. **Floating Overlay**
   - Auto-generated overlay
   - Click-to-trigger
   - Auto-remove functionality

## 📈 **Performance Metrics**

### **Expected Performance (Aggressive Preset)**
- **180 triggers per session**
- **100 triggers per hour**
- **60% popunder (108 triggers)**
- **40% direct links (72 triggers)**
- **2 detik global cooldown**

### **Revenue Optimization**
- **Dual revenue streams**: Popunder + Direct links
- **Fallback protection**: Jika satu gagal, yang lain aktif
- **Maximum coverage**: Semua user interactions dimanfaatkan
- **AdBlock resilience**: Multiple bypass methods

## 🔍 **Debug Mode**

### **Development Panel Features**
- Real-time trigger statistics
- Popunder vs Direct link ratio
- Available direct links status
- Individual link cooldowns
- Manual trigger testing
- Session statistics

### **Debug Information Display**
- Script loaded status
- Session/hourly counts
- Trigger stats breakdown
- Available links with cooldowns
- Last trigger timestamp

## 🎮 **Custom Configuration**

### **Custom Direct Links**
```tsx
<HybridPopunder 
  config={{
    directLinks: [
      {
        id: 'custom_1',
        url: 'https://example.com/offer',
        label: 'Custom Offer',
        weight: 9,
        type: 'offer',
        cooldown: 15,
        newTab: true
      }
    ],
    popunderRatio: 0.5 // 50% popunder, 50% direct
  }}
/>
```

### **Custom Event Selection**
```tsx
<HybridPopunder 
  config={{
    triggerEvents: ['click', 'touchstart', 'play', 'ended'],
    popunderRatio: 0.7
  }}
/>
```

### **Custom Ratio Configuration**
```tsx
<HybridPopunder 
  config={{
    popunderRatio: 0.3, // 30% popunder, 70% direct
    maxPerHour: 120,
    maxPerSession: 250
  }}
/>
```

## 🚨 **Best Practices**

### **1. Ratio Optimization**
- Start dengan balanced preset (70:30)
- Monitor performance metrics
- Adjust based on revenue data
- Test different ratios

### **2. Link Management**
- Rotate direct links regularly
- Monitor link performance
- Adjust weights based on conversion
- Update offers frequently

### **3. User Experience**
- Balance revenue vs UX
- Monitor bounce rates
- Test different cooldowns
- Consider mobile limitations

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Popunder tidak muncul**
   - Check script loading
   - Verify AdBlock status
   - Check fallback mode

2. **Direct links tidak trigger**
   - Verify link availability
   - Check cooldown status
   - Test floating overlay

3. **Ratio tidak sesuai**
   - Check randomization logic
   - Verify script loaded status
   - Monitor trigger stats

### **Debug Commands**
```javascript
// Check session data
localStorage.getItem('hybrid_popunder_data')

// Check available links
// Available in debug panel

// Reset session
localStorage.removeItem('hybrid_popunder_data')
```

## 🎯 **Advanced Usage**

### **Dynamic Ratio Adjustment**
```tsx
const [popunderRatio, setPopunderRatio] = useState(0.6)

// Adjust based on performance
useEffect(() => {
  if (performanceMetrics.popunderRevenue > performanceMetrics.directRevenue) {
    setPopunderRatio(0.7) // Increase popunder
  } else {
    setPopunderRatio(0.5) // Balance
  }
}, [performanceMetrics])
```

### **A/B Testing**
```tsx
const variants = {
  variantA: { popunderRatio: 0.7 },
  variantB: { popunderRatio: 0.5 },
  variantC: { popunderRatio: 0.3 }
}
```

## 🚀 **Future Enhancements**

1. **Machine Learning Ratio Optimization**
2. **Real-time Performance Analytics**
3. **Advanced Floating Overlays**
4. **Custom Trigger Patterns**
5. **Cross-Device Synchronization**

## 📊 **Expected Results**

### **Hybrid System Benefits**
- ✅ **Dual revenue streams** (Popunder + Direct)
- ✅ **180 triggers per session**
- ✅ **60:40 optimal ratio**
- ✅ **Fallback protection**
- ✅ **Floating overlay engagement**
- ✅ **Advanced analytics**
- ✅ **Mobile optimization**

### **Revenue Maximization**
- **Popunder Revenue**: 60% dari total triggers
- **Direct Link Revenue**: 40% dari total triggers
- **Fallback Protection**: Tidak ada revenue loss
- **Coverage**: Semua user interactions dimanfaatkan

## 🎯 **Implementation Summary**

Hybrid Popunder Manager memberikan:
- ✅ **Kombinasi optimal** popunder + direct links
- ✅ **60:40 ratio** untuk maksimalkan revenue
- ✅ **5 direct links** dengan weighted selection
- ✅ **Floating overlay** untuk engagement tambahan
- ✅ **Advanced analytics** dan tracking
- ✅ **Fallback protection** untuk reliability
- ✅ **Mobile optimization** untuk semua device

System ini dirancang untuk **maksimalkan revenue** dengan **dual approach** yang memastikan **setiap interaksi pengguna** menghasilkan revenue melalui popunder atau direct links!
