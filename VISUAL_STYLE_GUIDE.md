# 🎨 Visual Style Guide - Quick Reference

## 🌈 Color Gradients Reference

### Primary Gradients
```css
/* Blue → Purple → Pink */
from-blue-600 via-purple-600 to-pink-600

/* Purple → Pink */
from-purple-400 to-pink-500

/* Blue → Purple */
from-blue-500 to-purple-600
```

### Accent Gradients
```css
/* Green → Blue → Purple */
from-green-500 via-blue-500 to-purple-600

/* Yellow → Orange */
from-yellow-400 to-orange-500

/* Red → Pink */
from-red-500 to-pink-500

/* Emerald → Green */
from-emerald-500 to-green-600
```

---

## 🎯 Animation Classes Usage

### Entrance Animations
```jsx
// Fade in from bottom with upward movement
<div className="animate-fade-in-up">Content</div>

// Scale from small to normal size
<div className="animate-scale-in">Content</div>

// Slide in from right
<div className="animate-slide-in-right">Content</div>

// Slide in from left
<div className="animate-slide-in-left">Content</div>
```

### Continuous Animations
```jsx
// Smooth floating effect
<div className="animate-float">Floating Element</div>

// Pulsating glow
<div className="animate-pulse-glow">Glowing Element</div>
```

### With Delays
```jsx
// Staggered animations
<div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>First</div>
<div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>Second</div>
<div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>Third</div>
```

---

## ✨ Effect Classes Usage

### Glass Effect
```jsx
// Glassmorphism with backdrop blur
<div className="glass-effect">
  Semi-transparent with blur
</div>
```

### Gradient Text
```jsx
// Rainbow gradient on text
<h1 className="gradient-text">Colorful Heading</h1>
```

### Gradient Background
```jsx
// Multicolor gradient background
<div className="gradient-bg">Content</div>
```

### Neon Glow
```jsx
// Multi-layer neon shadow effect
<div className="neon-glow">Glowing Card</div>
```

### Hover Lift
```jsx
// Lift element on hover
<button className="hover-lift">Hover me</button>
```

---

## 🎨 Button Variations

### Primary Button
```jsx
<button className="btn-primary">
  Primary Action
</button>
```
- **Colors**: Blue → Purple → Pink gradient
- **Effect**: Shimmer animation, hover scale, shadow glow

### Secondary Button
```jsx
<button className="btn-secondary">
  Secondary Action
</button>
```
- **Colors**: Green → Blue → Purple gradient
- **Effect**: Hover scale, shadow enhancement

### Success Button
```jsx
<button className="btn-success">
  Success Action
</button>
```
- **Colors**: Emerald → Green gradient
- **Effect**: Hover scale, glow

### Danger Button
```jsx
<button className="btn-danger">
  Delete
</button>
```
- **Colors**: Red → Rose gradient
- **Effect**: Hover scale, red glow

### Outline Button
```jsx
<button className="btn-outline">
  Outline Action
</button>
```
- **Colors**: Gradient text, rainbow border
- **Effect**: Animated border, hover fill

---

## 🏷️ Badge Variations

### Badge Usage
```jsx
<span className="badge-primary">New</span>
<span className="badge-success">Active</span>
<span className="badge-warning">Pending</span>
<span className="badge-danger">Urgent</span>
<span className="badge-info">Info</span>
<span className="badge-secondary">Draft</span>
```

All badges feature:
- Gradient backgrounds
- Rounded corners
- Shadow effects
- Hover enhancements

---

## 📦 Card Patterns

### Standard Card
```jsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```
- **Effect**: Hover lift + scale
- **Shadow**: Enhanced on hover

### Card with Hover Lift
```jsx
<div className="card hover-lift">
  Enhanced hover effect
</div>
```

### Card with Neon Glow
```jsx
<div className="card neon-glow">
  Glowing card
</div>
```

### Card with Animation
```jsx
<div className="card animate-fade-in-up">
  Animated entrance
</div>
```

---

## 🎭 Input Styles

### Enhanced Input
```jsx
<input className="input" placeholder="Type here..." />
```
- **Background**: Subtle gradient
- **Focus**: Transform + glow effect
- **Border**: Animated on focus

### Input with Error
```jsx
<input className="input input-error" />
<span className="text-danger text-sm">Error message</span>
```

---

## 🌟 Loading States

### Spinner
```jsx
<div className="spinner"></div>
```
- **Effect**: Rainbow border animation
- **Size**: 40px default
- **Speed**: 1s rotation

### Loading Text
```jsx
<p className="text-gray-600 animate-pulse-glow">Loading...</p>
```

---

## 🎪 Decorative Elements

### Floating Shapes
```jsx
<div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 
     rounded-full mix-blend-multiply filter blur-xl 
     opacity-30 animate-float">
</div>
```

### Animated Background
```jsx
<div className="absolute inset-0 bg-gradient-to-br 
     from-blue-600 via-purple-600 to-pink-600" 
     style={{
       backgroundSize: '400% 400%',
       animation: 'gradient-shift 15s ease infinite'
     }}>
</div>
```

### Floating Particles
```jsx
{[...Array(20)].map((_, i) => (
  <div
    key={i}
    className="absolute w-2 h-2 bg-white rounded-full opacity-30"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 5}s`
    }}
  ></div>
))}
```

---

## 🎨 Layout Patterns

### Hero Section Pattern
```jsx
<section className="relative py-24 overflow-hidden">
  {/* Animated Background */}
  <div className="absolute inset-0 bg-gradient-to-br 
       from-blue-600 via-purple-600 to-pink-600"
       style={{backgroundSize: '400% 400%', 
               animation: 'gradient-shift 15s ease infinite'}}>
  </div>
  
  {/* Floating Shapes */}
  <div className="absolute top-20 left-10 w-72 h-72 
       bg-purple-400 rounded-full mix-blend-multiply 
       filter blur-xl opacity-30 animate-float">
  </div>
  
  {/* Content */}
  <div className="relative z-10">
    <h1 className="text-7xl font-bold text-white">Title</h1>
  </div>
</section>
```

### Feature Grid Pattern
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {features.map((feature, index) => (
    <div 
      key={index} 
      className="card hover-lift group animate-fade-in-up"
      style={{animationDelay: `${index * 0.1}s`}}
    >
      <div className="text-6xl mb-4 transform 
           group-hover:scale-125 group-hover:rotate-12 
           transition-all">
        {feature.icon}
      </div>
      <h3 className="text-2xl font-bold group-hover:gradient-text">
        {feature.title}
      </h3>
    </div>
  ))}
</div>
```

### Stats Section Pattern
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {stats.map((stat, index) => (
    <div key={index} className="glass-effect rounded-2xl p-6 hover-lift">
      <div className="text-4xl font-bold text-white">{stat.number}</div>
      <div className="text-white/80">{stat.label}</div>
    </div>
  ))}
</div>
```

---

## 🎯 Best Practices

### ✅ DO:
- Use staggered animation delays for lists
- Combine hover-lift with card classes
- Apply gradient-text sparingly for emphasis
- Use glass-effect on overlay elements
- Add neon-glow to important CTAs
- Implement animate-fade-in-up for content reveals

### ❌ DON'T:
- Don't use too many animations on one element
- Avoid gradient-shift on small elements
- Don't stack multiple glow effects
- Avoid excessive animation delays (>1s)
- Don't use neon-glow on every card

---

## 📱 Responsive Considerations

### Mobile Optimizations
```jsx
// Hide decorative elements on mobile
<div className="hidden md:block absolute ...">
  Floating shape
</div>

// Adjust text sizes
<h1 className="text-4xl md:text-7xl">
  Responsive Title
</h1>

// Stack on mobile, grid on desktop
<div className="grid grid-cols-1 md:grid-cols-3">
  Cards
</div>
```

---

## 🚀 Performance Tips

1. **Use CSS animations** (not JavaScript) for better performance
2. **Limit animate-float** to < 5 elements per page
3. **Use will-change** sparingly (already included in utilities)
4. **Optimize backdrop-blur** usage (glass-effect)
5. **Reduce box-shadows** on mobile if performance issues occur

---

## 🎨 Quick Copy-Paste Examples

### Animated Hero Button
```jsx
<Link to="/signup" className="btn-primary group">
  <span className="flex items-center gap-2">
    Get Started
    <svg className="w-5 h-5 transform group-hover:translate-x-2 
         transition-transform" fill="none" stroke="currentColor" 
         viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" 
            strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  </span>
</Link>
```

### Feature Card with Gradient Orb
```jsx
<div className="card hover-lift group relative">
  <div className="absolute top-0 right-0 w-32 h-32 
       bg-gradient-to-br from-purple-400 to-pink-500 
       opacity-10 rounded-full blur-2xl 
       group-hover:opacity-20 transition-opacity">
  </div>
  <h3 className="text-2xl font-bold group-hover:gradient-text">
    Feature Title
  </h3>
</div>
```

### Glass Navigation
```jsx
<nav className="glass-effect backdrop-blur-xl border-b 
     border-white/20 sticky top-0 z-50">
  Navigation content
</nav>
```

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Compatibility**: Modern browsers with CSS3 support
