// src/test/setup.ts
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Add custom jest-dom matchers
expect.extend(matchers)

// Cleanup after each test case
afterEach(() => {
  cleanup()
})

// Mock Lottie React to prevent canvas issues in tests
vi.mock('lottie-react', () => ({
  default: (props: any) => {
    return { type: 'div', props: { 'data-testid': 'lottie-animation', ...props } }
  },
}))

// Mock IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: class IntersectionObserver {
    constructor(public callback: IntersectionObserverCallback) {}
    
    observe() {
      return null
    }
    
    disconnect() {
      return null
    }
    
    unobserve() {
      return null
    }
  },
})

// Mock ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: class ResizeObserver {
    constructor(public callback: ResizeObserverCallback) {}
    
    observe() {
      return null
    }
    
    disconnect() {
      return null
    }
    
    unobserve() {
      return null
    }
  },
})

// Mock matchMedia for responsive design testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock scrollIntoView
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  writable: true,
  value: () => {},
})

// Mock canvas context for Lottie animations
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: () => ({
    fillStyle: '',
    fillRect: () => {},
    clearRect: () => {},
    drawImage: () => {},
    canvas: { width: 0, height: 0 },
  }),
})