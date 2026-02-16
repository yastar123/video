# Multi-Event Popunder Manager Documentation

## Overview

Multi-Event Popunder Manager adalah sistem popunder yang paling comprehensive dengan trigger di **25+ berbagai events**. Sistem ini dirancang untuk maksimalkan revenue dengan menangkap setiap interaksi pengguna sebagai potensi trigger.

## Script Iklan

```html
<script src="https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js"></script>
```

## 🎯 **Semua Events yang Tersedia (25+ Events)**

### **🖱️ Mouse Events (5 Events)**
| Event | Weight | Cooldown | Deskripsi |
|-------|--------|----------|-----------|
| `click` | 8 | 30s | Setiap klik (30% chance) |
| `dblclick` | 6 | 60s | Double click |
| `contextmenu` | 7 | 45s | Right click |
| `mousedown` | 5 | 20s | Mouse button down |
| `mouseup` | 4 | 20s | Mouse button up |

### **⌨️ Keyboard Events (2 Events)**
| Event | Weight | Cooldown | Deskripsi |
|-------|--------|----------|-----------|
| `keydown` | 3 | 15s | Enter, Space, Escape |
| `keyup` | 2 | 10s | Key release (disabled) |

### **📱 Touch Events (3 Events)**
| Event | Weight | Cooldown | Deskripsi |
|-------|--------|----------|-----------|
| `touchstart` | 7 | 25s | Touch start (mobile) |
| `touchend` | 6 | 25s | Touch end (40% chance) |
| `touchmove` | 3 | 30s | Touch movement |

### **📜 Scroll Events (2 Events)**
| Event | Weight | Cooldown | Deskripsi |
|-------|--------|----------|-----------|
| `scroll` | 5 | 40s | Page scroll (5% chance) |
| `wheel` | 4 | 20s | Mouse wheel (10% chance) |

### **🪟 Window Events (5 Events)**
| Event | Weight | Cooldown | Deskripsi |
|-------|--------|----------|-----------|
| `resize` | 2 | 60s | Window resize |
| `focus` | 3 | 30s | Window focus (20% chance) |
| `blur` | 4 | 30s | Window blur |
| `beforeunload` | 9 | 0s | Page leave |
| `pagehide` | 8 | 0s | Page hide |

### **📝 Form Events (3 Events)**
| Event | Weight | Cooldown | Deskripsi |
|-------|--------|----------|-----------|
| `submit` | 6 | 45s | Form submission |
| `change` | 2 | 15s | Input change |
| `input` | 1 | 10s | Text input (disabled) |

### **🎬 Media Events (4 Events)**
| Event | Weight | Cooldown | Deskripsi |
|-------|--------|----------|-----------|
| `play` | 7 | 50s | Video/audio play |
| `pause` | 5 | 40s | Video/audio pause (50% chance) |
| `ended` | 8 | 30s | Video/audio ended |
| `volumechange` | 3 | 20s | Volume change |

### **🎯 Drag Events (3 Events)**
| Event | Weight | Cooldown | Deskripsi |
|-------|--------|----------|-----------|
| `dragstart` | 4 | 30s | Drag start |
| `dragend` | 4 | 30s | Drag end |
| `drop` | 5 | 35s | Drop action |

### **🚀 Custom Events (5 Events)**
| Event | Weight | Cooldown | Deskripsi |
|-------|--------|----------|-----------|
| `mouseidle` | 6 | 90s | Mouse idle 5s |
| `scrolldepth` | 7 | 60s | 25% scroll depth |
| `dwelltime` | 5 | 120s | 1 minute dwell |
| `exitintent` | 9 | 0s | Mouse leave viewport |
| `inactivity` | 4 | 180s | 3 minutes inactive |

## ⚙️ **Konfigurasi Aktif (Maximum Preset)**

```tsx
<MultiEventPopunder 
  config={{
    ...EVENT_PRESETS.maximum, // Semua 25+ events aktif
    enabled: true,
    globalCooldown: 2, // 2 detik global cooldown
    maxPerHour: 100, // 100 popunder per jam
    maxPerSession: 200, // 200 popunder per session
    bypassAdBlock: true,
    stealthMode: true,
    mobileOptimized: true
  }}
/>
```

## 🎯 **Event Priorities & Weights**

### **High Priority (Weight 8-9)**
- `beforeunload` - 9 (Page leave)
- `exitintent` - 9 (Mouse exit)
- `click` - 8 (User clicks)
- `ended` - 8 (Media ended)
- `pagehide` - 8 (Page hide)

### **Medium Priority (Weight 5-7)**
- `contextmenu` - 7 (Right click)
- `touchstart` - 7 (Mobile touch)
- `play` - 7 (Media play)
- `scrolldepth` - 7 (Scroll engagement)
- `dblclick` - 6 (Double click)
- `submit` - 6 (Form submit)
- `touchend` - 6 (Touch end)
- `mouseidle` - 6 (Idle detection)

### **Low Priority (Weight 1-4)**
- `scroll` - 5 (Page scroll)
- `drop` - 5 (Drag drop)
- `mousedown` - 5 (Mouse down)
- `blur` - 4 (Window blur)
- `dragstart` - 4 (Drag start)
- `dragend` - 4 (Drag end)
- `wheel` - 4 (Mouse wheel)
- `mouseup` - 4 (Mouse up)

## 🔄 **Trigger Mechanisms**

### **1. Direct Triggers**
Events yang langsung trigger popunder:
- `click`, `dblclick`, `contextmenu`
- `touchstart`, `touchend`
- `play`, `pause`, `ended`
- `submit`, `beforeunload`, `pagehide`

### **2. Probability Triggers**
Events dengan probability-based triggering:
- `click`: 30% chance
- `touchend`: 40% chance
- `scroll`: 5% chance
- `wheel`: 10% chance (delta > 100)
- `focus`: 20% chance
- `pause`: 50% chance

### **3. Conditional Triggers**
Events dengan kondisi khusus:
- `keydown`: Enter, Space, Escape only
- `mousedown`: Right click only
- `wheel`: Delta > 100px
- `scrolldepth`: > 25% scroll
- `dwelltime`: > 60 seconds
- `mouseidle`: 5 seconds idle
- `exitintent`: Mouse Y <= 0
- `inactivity`: 3 minutes inactive

## 🛡️ **Advanced Features**

### **Stealth Mode**
```tsx
stealthMode: true
```
- Hidden script attributes
- Delayed loading (2 seconds)
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

### **Mobile Optimization**
```tsx
mobileOptimized: true
```
- Touch event support
- Responsive popunder
- Battery-friendly
- Performance optimized

## 📊 **Session Management**

### **Tracking Data**
```typescript
interface SessionData {
  sessionCount: number      // Total per session
  hourlyCount: number       // Total per hour
  lastTriggered: number     // Last trigger timestamp
  eventCooldowns: Record<string, number>  // Individual event cooldowns
  lastHourReset: number     // Hour reset timestamp
}
```

### **Storage Location**
- LocalStorage persistence
- Automatic hourly reset
- Session-based tracking
- Event-specific cooldowns

## 🎛️ **Event Presets**

### **Conservative** (3 Events)
```tsx
EVENT_PRESETS.conservative
```
- `click`, `scrolldepth`, `exitintent`
- Minimal user impact

### **Balanced** (5 Events)
```tsx
EVENT_PRESETS.balanced
```
- `click`, `touchstart`, `scroll`, `play`, `exitintent`
- Good balance

### **Aggressive** (11 Events)
```tsx
EVENT_PRESETS.aggressive
```
- Most high-value events
- High trigger rate

### **Maximum** (25+ Events) - **CURRENT**
```tsx
EVENT_PRESETS.maximum
```
- **ALL events enabled**
- **Maximum trigger rate**
- **Highest revenue potential**

## 🔧 **Custom Configuration**

### **Enable Specific Events**
```tsx
<MultiEventPopunder 
  config={{
    events: [
      { name: 'click', enabled: true, weight: 8, cooldown: 15 },
      { name: 'touchstart', enabled: true, weight: 7, cooldown: 20 },
      { name: 'play', enabled: true, weight: 7, cooldown: 30 },
      { name: 'exitintent', enabled: true, weight: 9, cooldown: 0 }
    ],
    globalCooldown: 3,
    maxPerHour: 50,
    maxPerSession: 100
  }}
/>
```

### **Custom Event Conditions**
```tsx
events: [
  { 
    name: 'keydown', 
    enabled: true, 
    weight: 5, 
    cooldown: 10,
    conditions: ['enter', 'space', 'escape', 'arrowup', 'arrowdown']
  }
]
```

## 🎯 **Trigger Techniques**

### **1. Standard Window.Open**
```javascript
const popunder = window.open('', '_blank', 'width=1,height=1,left=9999,top=9999')
```

### **2. Form Submission Bypass**
```javascript
const form = document.createElement('form')
form.method = 'GET'
form.action = POPUNDER_SCRIPT
form.target = '_blank'
form.submit()
```

### **3. Link Click Simulation**
```javascript
const link = document.createElement('a')
link.href = POPUNDER_SCRIPT
link.target = '_blank'
link.click()
```

## 📱 **Mobile-Specific Events**

### **Touch Events**
- `touchstart`: Setiap sentuhan
- `touchend`: Akhir sentuhan
- `touchmove`: Gerakan sentuhan

### **Mobile Optimizations**
- Responsive popunder sizing
- Touch-friendly triggers
- Battery-efficient
- Performance optimized

## 🎮 **Media Events**

### **Video/Audio Triggers**
- `play`: Saat media dimulai
- `pause`: Saat media dijeda
- `ended`: Saat media selesai
- `volumechange`: Saat volume diubah

### **Implementation**
```javascript
// Auto-attach to all media elements
document.querySelectorAll('video, audio').forEach(media => {
  media.addEventListener('play', triggerPopunder)
  media.addEventListener('ended', triggerPopunder)
})
```

## 🔍 **Debug Mode**

### **Development Panel**
- Real-time event monitoring
- Session statistics
- Event cooldown status
- Manual trigger testing
- Performance metrics

### **Debug Information**
- Script loaded status
- Active events list
- Trigger counts per event
- Global cooldown status
- Session/hourly limits

## 📈 **Performance Metrics**

### **Event Efficiency**
```javascript
// Track which events trigger most
const eventStats = {
  click: 45,        // 45 triggers
  touchstart: 32,   // 32 triggers
  play: 28,         // 28 triggers
  exitintent: 15    // 15 triggers
}
```

### **Success Rate**
- Trigger success percentage
- AdBlock bypass rate
- Mobile vs desktop performance
- Time-based performance

## 🚨 **Best Practices**

### **1. Event Selection**
- Start dengan conservative preset
- Monitor user feedback
- Gradually increase events
- Test different combinations

### **2. Cooldown Management**
- Balance frequency vs UX
- Individual event cooldowns
- Global cooldown override
- Time-based restrictions

### **3. Mobile Considerations**
- Touch event prioritization
- Battery impact
- Data usage optimization
- Performance monitoring

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Events tidak trigger**
   - Check event listener attachment
   - Verify event conditions
   - Check cooldown status

2. **Popunder tidak muncul**
   - Check browser popup settings
   - Verify script loading
   - Check AdBlock status

3. **Performance issues**
   - Reduce event frequency
   - Optimize event handlers
   - Check memory usage

### **Debug Commands**
```javascript
// Check event listeners
getEventListeners(document)

// Monitor triggers
localStorage.getItem('multi_event_popunder_data')

// Reset session
localStorage.removeItem('multi_event_popunder_data')
```

## 🎯 **Advanced Usage**

### **Dynamic Event Configuration**
```tsx
const [events, setEvents] = useState(DEFAULT_EVENTS)

// Enable events based on user behavior
useEffect(() => {
  if (userIsMobile) {
    setEvents(prev => prev.map(e => 
      e.name.startsWith('touch') ? {...e, enabled: true} : e
    ))
  }
}, [userIsMobile])
```

### **A/B Testing Events**
```tsx
const eventVariants = {
  variantA: ['click', 'touchstart', 'exitintent'],
  variantB: ['play', 'ended', 'scrolldepth'],
  variantC: DEFAULT_EVENTS.map(e => e.name)
}
```

## 🚀 **Future Enhancements**

1. **Machine Learning Event Selection**
2. **Real-time Performance Optimization**
3. **Advanced Bypass Techniques**
4. **Cross-Device Event Syncing**
5. **Behavioral Event Adaptation**

## 📊 **Expected Results**

### **Maximum Preset Performance**
- **200+ popunder per session**
- **100+ popunder per hour**
- **25+ trigger events**
- **2 detik global cooldown**
- **Stealth mode aktif**

### **Revenue Optimization**
- Maximum trigger opportunities
- Comprehensive event coverage
- Advanced bypass techniques
- Mobile-optimized triggers

## 🎯 **Implementation Summary**

Multi-Event Popunder Manager dengan **Maximum Preset** memberikan:
- ✅ **25+ trigger events** aktif
- ✅ **200 popunder per session**
- ✅ **2 detik global cooldown**
- ✅ **Stealth mode & AdBlock bypass**
- ✅ **Mobile optimization**
- ✅ **Advanced analytics**
- ✅ **Real-time debugging**

System ini dirancang untuk **maksimalkan revenue** dengan menangkap **setiap interaksi pengguna** sebagai potensi trigger popunder!
