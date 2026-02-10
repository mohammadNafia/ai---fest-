import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';
import { captureException } from '@/utils/sentry';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

interface ErrorBoundaryProps {
  children: ReactNode;
  isAdmin?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Send error to Sentry
    captureException(error, {
      errorInfo,
      componentStack: errorInfo.componentStack,
      isAdmin: this.props.isAdmin,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          onReset={this.handleReset}
          onReload={this.handleReload}
          error={this.state.error}
          isAdmin={this.props.isAdmin}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  onReset: () => void;
  onReload: () => void;
  error: Error | null;
  isAdmin?: boolean;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ onReset, onReload, error, isAdmin = false }) => {
  // Hooks must be called unconditionally - providers should always be available
  // If they're not, the error will be caught by the parent error boundary
  const { lang } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-50' : 'bg-[#00040F]'
    }`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`max-w-md w-full rounded-2xl border p-8 text-center transition-colors ${
        theme === 'light'
          ? 'bg-white border-gray-200 shadow-xl'
          : 'bg-[#0a0a1a] border-white/10 shadow-2xl'
      }`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          theme === 'light' ? 'bg-red-100' : 'bg-red-500/20'
        }`}>
          <AlertTriangle size={32} className={theme === 'light' ? 'text-red-600' : 'text-red-400'} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {lang === 'ar' ? 'حدث خطأ' : 'Something went wrong'}
        </h2>
        <p className={`mb-2 ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {lang === 'ar' 
            ? 'نعتذر، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
            : 'We apologize, an unexpected error occurred. Please try again.'}
        </p>
        {isAdmin && (
          <p className={`text-xs mb-6 ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {lang === 'ar' 
              ? 'خطأ في لوحة التحكم'
              : 'Admin Dashboard Error'}
          </p>
        )}
        {error && process.env.NODE_ENV === 'development' && (
          <details className={`mt-4 mb-6 text-left ${
            theme === 'light' ? 'bg-gray-50' : 'bg-black/30'
          } p-4 rounded-lg`}>
            <summary className={`cursor-pointer text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {lang === 'ar' ? 'تفاصيل الخطأ' : 'Error Details'}
            </summary>
            <pre className={`text-xs overflow-auto ${
              theme === 'light' ? 'text-red-600' : 'text-red-400'
            }`}>
              {error.toString()}
            </pre>
          </details>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onReset}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              theme === 'light'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            <RotateCcw size={18} />
            {lang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </button>
          <button
            onClick={onReload}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors border ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
            }`}
          >
            <RefreshCw size={18} />
            {lang === 'ar' ? 'إعادة تحميل الصفحة' : 'Reload Page'}
          </button>
        </div>
      </div>
    </div>
  );
};

// General Error Boundary (wraps entire app)
export const GeneralErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundaryClass>{children}</ErrorBoundaryClass>
);

// Admin Error Boundary (wraps admin dashboard)
export const AdminErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundaryClass isAdmin={true}>{children}</ErrorBoundaryClass>
);

// Default export for backward compatibility
export default ErrorBoundaryClass;

