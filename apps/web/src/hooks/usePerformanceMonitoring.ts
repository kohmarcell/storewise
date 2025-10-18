import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  loadTime: number
  domContentLoaded: number
  firstPaint: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  totalBlockingTime: number
}

export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [performanceScore, setPerformanceScore] = useState<number>(0)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) {
      return
    }

    // Wait for page to fully load
    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')
      const lcp = performance.getEntriesByType('largest-contentful-paint')[0]
      const fid = performance.getEntriesByType('first-input')[0]
      const cls = performance.getEntriesByType('layout-shift')
      const longTasks = performance.getEntriesByType('long-task')

      // Calculate Core Web Vitals
      const lcpValue = lcp ? lcp.startTime : 0
      const fidValue = fid ? fid.processingStart - fid.startTime : 0
      const clsValue = cls.reduce((sum, entry) => sum + entry.value, 0)
      const tbt = longTasks.reduce((sum, entry) => sum + entry.duration, 0)

      const newMetrics: PerformanceMetrics = {
        loadTime: navigation.loadEventEnd - navigation.navigationStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        largestContentfulPaint: lcpValue,
        firstInputDelay: fidValue,
        cumulativeLayoutShift: clsValue,
        totalBlockingTime: tbt
      }

      setMetrics(newMetrics)

      // Calculate performance score (0-100)
      const score = calculatePerformanceScore(newMetrics)
      setPerformanceScore(score)

      // Send metrics to monitoring service
      sendMetricsToMonitoring(newMetrics, score)
    }

    // Measure performance after page load
    if (document.readyState === 'complete') {
      setTimeout(measurePerformance, 0)
    } else {
      window.addEventListener('load', () => setTimeout(measurePerformance, 0))
    }
  }, [])

  return {
    metrics,
    performanceScore
  }
}

function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  let score = 100

  // LCP scoring (0-100)
  if (metrics.largestContentfulPaint > 4000) score -= 40
  else if (metrics.largestContentfulPaint > 2500) score -= 25
  else if (metrics.largestContentfulPaint > 1800) score -= 10

  // FID scoring (0-100)
  if (metrics.firstInputDelay > 300) score -= 30
  else if (metrics.firstInputDelay > 100) score -= 15
  else if (metrics.firstInputDelay > 50) score -= 5

  // CLS scoring (0-100)
  if (metrics.cumulativeLayoutShift > 0.25) score -= 30
  else if (metrics.cumulativeLayoutShift > 0.1) score -= 15
  else if (metrics.cumulativeLayoutShift > 0.05) score -= 5

  // Load time scoring (0-100)
  if (metrics.loadTime > 5000) score -= 20
  else if (metrics.loadTime > 3000) score -= 10
  else if (metrics.loadTime > 2000) score -= 5

  return Math.max(0, Math.min(100, score))
}

function sendMetricsToMonitoring(metrics: PerformanceMetrics, score: number) {
  // Send to monitoring service
  const payload = {
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    metrics,
    score,
    sessionId: getSessionId()
  }

  // Send to analytics endpoint
  fetch('/api/v1/analytics/performance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  }).catch(error => {
    console.error('Failed to send performance metrics:', error)
  })
}

function getSessionId(): string {
  let sessionId = localStorage.getItem('sessionId')
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem('sessionId', sessionId)
  }
  return sessionId
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}