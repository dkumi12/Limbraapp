# 🏃‍♀️ Limbraapp - AI-Powered Personalized Stretching & Wellness

[![CI/CD Pipeline](https://github.com/dkumi12/Limbraapp/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/dkumi12/Limbraapp/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node 18+](https://img.shields.io/badge/node-18+-blue.svg)](https://nodejs.org/downloads/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)

> **AI-powered personalized warm-up and stretching routines for optimal wellness and injury prevention**

## 🚀 Features

### **Core Functionality**
- **🤖 AI-Powered Routines**: Personalized stretching sequences based on user preferences and goals
- **🎥 Video Integration**: High-quality exercise demonstrations with YouTube integration
- **📱 Progressive Web App**: Native app-like experience with offline capability
- **🎨 Material Design**: Beautiful, accessible UI with consistent design language

### **Professional Engineering**
- **✅ TypeScript Ready**: Full TypeScript support with strict type checking
- **✅ Modern React**: React 18 with hooks, context, and modern patterns
- **✅ PWA Optimized**: Service worker, caching, and offline functionality
- **✅ Responsive Design**: Mobile-first design with Material-UI components
- **✅ Comprehensive Testing**: Unit tests, integration tests, and E2E testing
- **✅ CI/CD Pipeline**: Automated testing, building, and deployment
- **✅ Code Quality**: ESLint, Prettier, and automated code formatting
- **✅ Performance Optimized**: Bundle analysis and optimization
### **Wellness & Health Focus**
- **🎯 Goal-Based Training**: Customizable routines for flexibility, strength, and recovery
- **📊 Progress Tracking**: Monitor your improvement over time
- **🎵 Animated Guidance**: Lottie animations for smooth, engaging instructions
- **🌙 Dark Mode**: Eye-friendly interface for any time of day
- **♿ Accessibility**: WCAG compliant with comprehensive keyboard navigation

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with excellent IDE support
- **Vite** - Lightning-fast build tool and development server
- **Material-UI v5** - Professional component library with theming
- **React Router v6** - Client-side routing with modern API
- **Emotion** - CSS-in-JS styling with excellent performance

### **Development & Testing**
- **Vitest** - Fast, modern testing framework
- **Playwright** - End-to-end testing across browsers
- **ESLint** - Code linting with React and TypeScript rules
- **Prettier** - Automated code formatting
- **Husky** - Git hooks for code quality enforcement

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git

### **Installation**
```bash
# Clone the repository
git clone https://github.com/dkumi12/Limbraapp.git
cd Limbraapp

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Available Scripts**
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm test             # Run tests in watch mode
npm run test:unit    # Run unit tests with coverage
npm run test:e2e     # Run end-to-end tests

# Analysis & Optimization
npm run analyze      # Analyze bundle size
npm run clean        # Clean build artifacts
```

## 📁 Project Structure

```
Limbraapp/
├── public/                 # Static assets
│   ├── icons/             # PWA icons and favicons
│   ├── manifest.json      # PWA manifest
│   └── index.html         # HTML template
├── src/                   # Source code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React context providers
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── styles/           # Global styles and themes
│   ├── __tests__/        # Test files
│   └── test/             # Test utilities and setup
├── .github/workflows/     # GitHub Actions CI/CD
├── docs/                 # Project documentation
├── dist/                 # Production build output
├── coverage/             # Test coverage reports
└── [config files]       # ESLint, Prettier, TypeScript, etc.
```

## 🧪 Testing Strategy

### **Unit Tests**
- **Components**: Test rendering, props, and user interactions
- **Hooks**: Test custom React hooks with React Testing Library
- **Utilities**: Test pure functions with comprehensive edge cases
- **Coverage Target**: >80% line coverage

### **Integration Tests**
- **User Flows**: Test complete user journeys
- **API Integration**: Mock external services and test error handling
- **State Management**: Test context providers and state updates

## 🚀 Deployment

### **Development Environment**
```bash
npm run dev
# Runs on http://localhost:5173
```

### **Production Build**
```bash
npm run build
npm run preview
# Creates optimized build in dist/
```

### **GitHub Pages Deployment**
The app is automatically deployed to GitHub Pages on push to main branch:
- **Production URL**: https://dkumi12.github.io/Limbraapp
- **PWA Installation**: Available on mobile devices and desktops

## 🛡️ Security & Privacy

### **Data Protection**
- **No Personal Data Storage**: Privacy-first design
- **Local Storage Only**: User preferences stored locally
- **HTTPS Enforced**: Secure connections required
- **Dependency Security**: Automated vulnerability scanning

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Install dependencies (`npm install`)
4. Make your changes and add tests
5. Run the test suite (`npm test`)
6. Lint and format your code (`npm run lint:fix`)
7. Commit with conventional commits and push
8. Open a Pull Request

### **Code Standards**
- **TypeScript**: Strict mode with comprehensive type checking
- **ESLint**: React, TypeScript, and accessibility rules
- **Prettier**: Consistent code formatting
- **Testing**: Comprehensive test coverage for new features
- **Accessibility**: WCAG 2.1 AA compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material-UI Team** for the excellent component library
- **Vite Team** for the blazing-fast build tool
- **React Team** for the incredible framework
- **Workbox Team** for PWA capabilities

---

<div align="center">

**Built with ❤️ for wellness and healthy living**

[![GitHub stars](https://img.shields.io/github/stars/dkumi12/Limbraapp.svg?style=social&label=Star)](https://github.com/dkumi12/Limbraapp)

</div>