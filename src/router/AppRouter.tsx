import { Suspense, lazy, FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { GeneralErrorBoundary } from '@/components/common/ErrorBoundary';

// Pages - Lazy loaded for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const AgendaPage = lazy(() => import('@/pages/AgendaPage'));
const EcosystemPage = lazy(() => import('@/pages/EcosystemPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));


// Layout Components
import { PageLayout, PageTransition } from '@/layout';

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className={`h-6 rounded ${
        theme === 'light' ? 'bg-gray-200' : 'bg-white/10'
      }`}></div>
      <div className={`h-6 rounded w-2/3 ${
        theme === 'light' ? 'bg-gray-200' : 'bg-white/10'
      }`}></div>
      <div className={`h-48 rounded ${
        theme === 'light' ? 'bg-gray-200' : 'bg-white/10'
      }`}></div>
    </div>
  );
};

// Router Component
const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Layout */}
        <Route 
          path="/" 
          element={
            <PageLayout>
              <PageTransition>
                <Suspense fallback={<LoadingSkeleton />}>
                  <HomePage />
                </Suspense>
              </PageTransition>
            </PageLayout>
          } 
        />
        <Route 
          path="/home" 
          element={<Navigate to="/" replace />}
        />
        <Route 
          path="/about" 
          element={
            <PageLayout>
              <PageTransition>
                <Suspense fallback={<LoadingSkeleton />}>
                  <AboutPage />
                </Suspense>
              </PageTransition>
            </PageLayout>
          } 
        />
        <Route 
          path="/agenda" 
          element={
            <PageLayout>
              <PageTransition>
                <Suspense fallback={<LoadingSkeleton />}>
                  <AgendaPage />
                </Suspense>
              </PageTransition>
            </PageLayout>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <PageLayout>
              <PageTransition>
                <Suspense fallback={<LoadingSkeleton />}>
                  <ContactPage />
                </Suspense>
              </PageTransition>
            </PageLayout>
          } 
        />
        
        <Route 
          path="/ecosystem" 
          element={
            <PageLayout>
              <PageTransition>
                <Suspense fallback={<LoadingSkeleton />}>
                  <EcosystemPage />
                </Suspense>
              </PageTransition>
            </PageLayout>
          } 
        />
        
        {/* 404 Not Found */}
        <Route 
          path="/404" 
          element={
            <PageLayout>
              <PageTransition>
                <Suspense fallback={<LoadingSkeleton />}>
                  <NotFound />
                </Suspense>
              </PageTransition>
            </PageLayout>
          } 
        />
        
        {/* Catch all - redirect to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// Main App Wrapper with Providers
const AppWithProviders: FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <GeneralErrorBoundary>
          <AppRouter />
        </GeneralErrorBoundary>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AppWithProviders;

