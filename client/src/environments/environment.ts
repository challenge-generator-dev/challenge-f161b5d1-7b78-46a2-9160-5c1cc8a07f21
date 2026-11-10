export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  wsEndpoint: 'ws://localhost:3000',
  sseEndpoint: 'http://localhost:3000/orders/stream',
  retryAttempts: 3,
  retryDelay: 1000,
  requestTimeout: 30000,
  cacheEnabled: true,
  cacheTTL: 300000,
  maxConcurrentRequests: 10,
  enableDebugMode: true,
  logLevel: 'debug' as const,
  enablePerformanceMonitoring: true,
  enableErrorTracking: true,
  featureFlags: {
    enableRealTimeUpdates: true,
    enableOrderNotifications: true,
    enableOrderAnalytics: false,
    enableDarkMode: false,
    enableExperimentalUI: false
  },
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100]
  },
  ui: {
    animationsEnabled: true,
    skeletonLoadingEnabled: true,
    toastDuration: 4000,
    confirmDialogTimeout: 10000
  },
  security: {
    tokenRefreshInterval: 300000,
    sessionTimeout: 1800000,
    enableCSRFProtection: true
  },
  analytics: {
    trackingId: '',
    enabled: false
  }
};