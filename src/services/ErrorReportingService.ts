/**
 * Error Reporting & Analytics Service
 * Tracks errors, performance metrics, and user analytics
 */

export interface ErrorReport {
  id: string;
  timestamp: Date;
  userId?: string;
  error: {
    message: string;
    stack?: string;
    type: string;
    source: string;
  };
  context: {
    url: string;
    userAgent: string;
    viewport: { width: number; height: number };
    component?: string;
    action?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

export interface PerformanceMetric {
  id: string;
  timestamp: Date;
  userId?: string;
  metric: {
    name: string;
    value: number;
    unit: string;
  };
  context: {
    component?: string;
    action?: string;
    duration?: number;
  };
}

export interface UserAnalytics {
  sessionId: string;
  userId?: string;
  events: AnalyticsEvent[];
  sessionStart: Date;
  sessionEnd?: Date;
  totalDuration?: number;
}

export interface AnalyticsEvent {
  id: string;
  timestamp: Date;
  type: 'page_view' | 'click' | 'form_submit' | 'api_call' | 'error' | 'feature_use';
  data: Record<string, any>;
}

export class ErrorReportingService {
  private static instance: ErrorReportingService;
  private errorReports: ErrorReport[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private currentSession: UserAnalytics;
  private isEnabled = true;

  static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  private constructor() {
    this.initializeSession();
    this.setupGlobalErrorHandlers();
    this.setupPerformanceMonitoring();
    this.loadStoredData();
  }

  private initializeSession() {
    this.currentSession = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      events: [],
      sessionStart: new Date()
    };

    // Track session start
    this.trackEvent('session_start', {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      referrer: document.referrer
    });
  }

  private setupGlobalErrorHandlers() {
    // Catch unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        type: 'javascript',
        source: event.filename || 'unknown'
      }, 'high', {
        component: 'global',
        action: 'unhandled_error'
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        type: 'promise',
        source: 'promise_rejection'
      }, 'medium', {
        component: 'global',
        action: 'unhandled_promise'
      });
    });

    // Catch React errors (if using error boundaries)
    this.setupReactErrorBoundary();
  }

  private setupReactErrorBoundary() {
    // This would be implemented in a React Error Boundary component
    // For now, we'll just set up a global handler
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.('React')) {
        this.reportError({
          message: args.join(' '),
          type: 'react',
          source: 'react_error'
        }, 'high', {
          component: 'react',
          action: 'component_error'
        });
      }
      originalConsoleError.apply(console, args);
    };
  }

  private setupPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        this.recordMetric('page_load_time', navigation.loadEventEnd - navigation.fetchStart, 'ms', {
          component: 'page',
          action: 'load'
        });

        this.recordMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart, 'ms', {
          component: 'dom',
          action: 'content_loaded'
        });
      }, 0);
    });

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.recordMetric('long_task', entry.duration, 'ms', {
              component: 'performance',
              action: 'long_task'
            });
          }
        });
      });
      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  private loadStoredData() {
    try {
      const storedErrors = localStorage.getItem('error_reports');
      if (storedErrors) {
        this.errorReports = JSON.parse(storedErrors).map((report: any) => ({
          ...report,
          timestamp: new Date(report.timestamp)
        }));
      }

      const storedMetrics = localStorage.getItem('performance_metrics');
      if (storedMetrics) {
        this.performanceMetrics = JSON.parse(storedMetrics).map((metric: any) => ({
          ...metric,
          timestamp: new Date(metric.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Failed to load stored analytics data:', error);
    }
  }

  private saveData() {
    try {
      localStorage.setItem('error_reports', JSON.stringify(this.errorReports.slice(-100))); // Keep last 100
      localStorage.setItem('performance_metrics', JSON.stringify(this.performanceMetrics.slice(-200))); // Keep last 200
    } catch (error) {
      console.warn('Failed to save analytics data:', error);
    }
  }

  reportError(
    error: Omit<ErrorReport['error'], 'source'> & { source?: string },
    severity: ErrorReport['severity'] = 'medium',
    context?: Partial<ErrorReport['context']>
  ): string {
    if (!this.isEnabled) return '';

    const errorReport: ErrorReport = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId: this.getCurrentUserId(),
      error: {
        ...error,
        source: error.source || 'unknown'
      },
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        ...context
      },
      severity,
      resolved: false
    };

    this.errorReports.push(errorReport);
    this.saveData();

    // Track as analytics event
    this.trackEvent('error', {
      errorId: errorReport.id,
      severity,
      message: error.message,
      type: error.type
    });

    // Send to external service in production
    this.sendToExternalService('error', errorReport);

    console.error('Error reported:', errorReport);
    return errorReport.id;
  }

  recordMetric(
    name: string,
    value: number,
    unit: string = 'count',
    context?: Partial<PerformanceMetric['context']>
  ): string {
    if (!this.isEnabled) return '';

    const metric: PerformanceMetric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId: this.getCurrentUserId(),
      metric: { name, value, unit },
      context: context || {}
    };

    this.performanceMetrics.push(metric);
    this.saveData();

    // Track as analytics event
    this.trackEvent('performance_metric', {
      metricId: metric.id,
      name,
      value,
      unit
    });

    return metric.id;
  }

  trackEvent(type: AnalyticsEvent['type'], data: Record<string, any> = {}): string {
    if (!this.isEnabled) return '';

    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type,
      data
    };

    this.currentSession.events.push(event);

    // Send to external analytics service
    this.sendToExternalService('analytics', event);

    return event.id;
  }

  trackPageView(path: string, title?: string): void {
    this.trackEvent('page_view', {
      path,
      title: title || document.title,
      referrer: document.referrer
    });
  }

  trackFeatureUse(feature: string, details?: Record<string, any>): void {
    this.trackEvent('feature_use', {
      feature,
      ...details
    });
  }

  trackAPICall(endpoint: string, duration: number, success: boolean): void {
    this.trackEvent('api_call', {
      endpoint,
      duration,
      success
    });

    this.recordMetric(`api_${endpoint}_duration`, duration, 'ms', {
      action: 'api_call'
    });
  }

  private getCurrentUserId(): string | undefined {
    // This would integrate with your auth service
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id;
      }
    } catch {
      // Ignore errors
    }
    return undefined;
  }

  private sendToExternalService(type: 'error' | 'analytics', data: any): void {
    // In production, this would send to services like:
    // - Sentry for error reporting
    // - Google Analytics for user analytics
    // - Custom analytics endpoint
    
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to external service
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      }).catch(error => {
        console.warn('Failed to send analytics data:', error);
      });
    }
  }

  getErrorReports(severity?: ErrorReport['severity']): ErrorReport[] {
    let reports = [...this.errorReports];
    
    if (severity) {
      reports = reports.filter(report => report.severity === severity);
    }
    
    return reports.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getPerformanceMetrics(metricName?: string): PerformanceMetric[] {
    let metrics = [...this.performanceMetrics];
    
    if (metricName) {
      metrics = metrics.filter(metric => metric.metric.name === metricName);
    }
    
    return metrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getCurrentSession(): UserAnalytics {
    return {
      ...this.currentSession,
      totalDuration: Date.now() - this.currentSession.sessionStart.getTime()
    };
  }

  getAnalyticsSummary(): {
    totalErrors: number;
    criticalErrors: number;
    averagePageLoadTime: number;
    totalEvents: number;
    sessionDuration: number;
  } {
    const criticalErrors = this.errorReports.filter(e => e.severity === 'critical').length;
    
    const pageLoadMetrics = this.performanceMetrics.filter(m => m.metric.name === 'page_load_time');
    const averagePageLoadTime = pageLoadMetrics.length > 0
      ? pageLoadMetrics.reduce((sum, m) => sum + m.metric.value, 0) / pageLoadMetrics.length
      : 0;

    return {
      totalErrors: this.errorReports.length,
      criticalErrors,
      averagePageLoadTime,
      totalEvents: this.currentSession.events.length,
      sessionDuration: Date.now() - this.currentSession.sessionStart.getTime()
    };
  }

  resolveError(errorId: string): boolean {
    const error = this.errorReports.find(e => e.id === errorId);
    if (error) {
      error.resolved = true;
      this.saveData();
      return true;
    }
    return false;
  }

  clearOldData(daysToKeep: number = 30): void {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    this.errorReports = this.errorReports.filter(report => report.timestamp > cutoffDate);
    this.performanceMetrics = this.performanceMetrics.filter(metric => metric.timestamp > cutoffDate);
    
    this.saveData();
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }
}