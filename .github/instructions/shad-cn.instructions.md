---
applyTo: **/*.ts, **/*.js
description: shadcn rules
---

Usage Rule
When asked to use shadcn components, use the MCP server.
Planning Rule
When asked to plan using anything related to shadcn

Use the MCP server during planning
Apply components wherever components are applicable Use whole blocks where possible (e.g., login page calendar)

Implementation Rule
When implementing:

First call the demo tool to see how it is used
Then implement it so that it is implemented correctly

## Container Centering & Layout Guidelines

### Critical Container Rules

- **ALWAYS** include `mx-auto` with container elements: `<div className="container max-w-7xl mx-auto">`
- Never use container class alone without centering
- Root cause of layout issues: `container` class doesn't auto-center, requires `mx-auto`

### Development Testing Checklist

- [ ] Test on multiple screen sizes, especially 1400px+ wide screens
- [ ] Use browser dev tools to check layout on ultra-wide displays
- [ ] Add temporary visual guides (borders/backgrounds) during development
- [ ] Test specific viewport widths: 1200px, 1440px, 1920px, 2560px

### Code Standards

```tsx
// ✅ CORRECT - Always include mx-auto
<div className="container max-w-7xl mx-auto">

// ❌ WRONG - Missing centering
<div className="container max-w-7xl">

// 💡 RECOMMENDED - Create utility class
.container-centered {
  @apply container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

### Code Review Requirements

- [ ] Verify `mx-auto` is present on all main containers
- [ ] Check max-width constraints are working properly
- [ ] Ensure consistent spacing and alignment patterns
- [ ] Test responsive behavior at extreme viewport sizes

### Common Layout Bug Pattern

**Symptom**: Excessive whitespace on right side, left-aligned content
**Cause**: Missing `mx-auto` on container elements
**Fix**: Add `mx-auto` to all container divs
**Scope**: Often affects all sections (hero, features, social proof, header, footer)
