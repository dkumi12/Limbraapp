// src/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest'

// Utility function examples for the wellness app
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const calculateBMI = (weightKg: number, heightM: number): number => {
  if (heightM <= 0 || weightKg <= 0) {
    throw new Error('Weight and height must be positive numbers')
  }
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

describe('Wellness Utility Functions', () => {
  describe('formatDuration', () => {
    it('should format workout durations correctly', () => {
      expect(formatDuration(65)).toBe('1:05')
      expect(formatDuration(120)).toBe('2:00')
      expect(formatDuration(30)).toBe('0:30')
    })

    it('should handle edge cases', () => {
      expect(formatDuration(0)).toBe('0:00')
      expect(formatDuration(3661)).toBe('61:01') // More than 60 minutes
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true)
      expect(validateEmail('wellness.user@domain.co.uk')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
    })
  })

  describe('calculateBMI', () => {
    it('should calculate BMI correctly', () => {
      expect(calculateBMI(70, 1.75)).toBe(22.9) // Normal weight
      expect(calculateBMI(60, 1.60)).toBe(23.4) // Normal weight
    })

    it('should handle edge cases and validation', () => {
      expect(() => calculateBMI(0, 1.75)).toThrow('Weight and height must be positive numbers')
      expect(() => calculateBMI(70, 0)).toThrow('Weight and height must be positive numbers')
      expect(() => calculateBMI(-70, 1.75)).toThrow('Weight and height must be positive numbers')
    })
  })

  describe('capitalizeFirstLetter', () => {
    it('should format exercise names correctly', () => {
      expect(capitalizeFirstLetter('hamstring stretch')).toBe('Hamstring stretch')
      expect(capitalizeFirstLetter('SHOULDER ROLL')).toBe('Shoulder roll')
      expect(capitalizeFirstLetter('nEcK sTrEtCh')).toBe('Neck stretch')
    })

    it('should handle edge cases', () => {
      expect(capitalizeFirstLetter('')).toBe('')
      expect(capitalizeFirstLetter('a')).toBe('A')
    })
  })
})