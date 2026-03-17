# Stretch Easy - Styling Guide

## Overview
The app now uses a modern, clean design system inspired by Material Design principles with a custom color scheme.

## Color Palette
- **Primary Green**: `#22c55e` - Used for primary actions and active states
- **Primary Green Dark**: `#16a34a` - Used for hover states
- **Header Text**: `#1e293b` - Main headings
- **Subheader Text**: `#475569` - Secondary text
- **Body Text**: `#334155` - Regular content
- **Light Gray**: `#64748b` - Muted text and inactive elements
- **Background Primary**: `#f0f4f8` - Page background
- **White**: `#ffffff` - Card backgrounds
- **Border Light**: `#e2e8f0` - Subtle borders

## Typography
- **Font Family**: Inter (with system font fallbacks)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## Components

### Navigation Bar
- Fixed bottom navigation with 4 main sections
- Active state indicated with primary green color
- Material Icons for visual consistency

### Quick Start Tags
- Rounded pill-shaped buttons
- Icon + text layout
- Color-coded icons for different routines

### Time Buttons
- Clean, minimal design
- Active state with primary green background
- Equal spacing in a flex layout

### Goal Cards
- Card-based layout with shadows
- Icon + title + description structure
- Chevron icon for navigation hint
- Active state with primary green background

### Timer Display
- Large, monospace font for clarity
- Color states: normal (green), warning (orange), danger (red)
- Shake animation when time is critical

### Progress Bars
- Smooth animations
- Primary green fill color
- Used for both exercise progress and overall routine progress

## Responsive Design
- Mobile-first approach
- Breakpoints at 768px, 640px, and 480px
- Stack layouts on smaller screens
- Full-width container on mobile

## Animations
- Smooth transitions (0.2s ease)
- Bounce animation for celebration
- Shake animation for timer warnings
- Fade-in for page transitions
- Spin animation for loading states

## Accessibility
- Focus states with visible outlines
- High contrast text
- Clear button states
- Semantic HTML structure

## Dark Mode Support
- Automatic detection via `prefers-color-scheme`
- Adjusted color palette for dark backgrounds
- Maintains contrast ratios

## Usage
All styling is contained in `src/theme.css`. The app uses CSS custom properties (variables) for easy theme customization.

To modify colors, update the CSS variables in the `:root` selector in `theme.css`.

## Icons
The app uses Google Material Icons. Icons are included via CDN in the index.html file.