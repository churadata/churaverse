import type { MetricType } from 'web-vitals'

const reportWebVitals = (onPerfEntry?: (metric: MetricType) => void): void => {
  if (onPerfEntry !== undefined && onPerfEntry instanceof Function) {
    void import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry)
      onINP(onPerfEntry)
      onFCP(onPerfEntry)
      onLCP(onPerfEntry)
      onTTFB(onPerfEntry)
    })
  }
}

export default reportWebVitals
