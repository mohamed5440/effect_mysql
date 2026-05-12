import React, { lazy, Suspense, useEffect, Component } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Error Boundary Component
class ErrorBoundary extends Component<any, any> {
  state = { hasError: false, error: null };
  
  constructor(props: any) {
    super(props);
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-deep-black text-white flex flex-col items-center justify-center p-4 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-black mb-4">عذراً، حدث خطأ ما</h1>
          <p className="text-white/50 mb-8 max-w-md">حدث خطأ غير متوقع أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.</p>
          <button 
            onClick={() => window.location.href = "/ar"}
            className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-accent hover:text-white transition-all"
          >
            العودة للرئيسية / Back to Home
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 bg-white/5 rounded-xl text-left text-xs overflow-auto max-w-full text-red-400 border border-white/10">
              {(this.state as any).error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return (this as any).props.children;
  }
}

const Home = lazy(() => import("./pages/Home"));
const JoinUs = lazy(() => import("./pages/JoinUs"));
const Contact = lazy(() => import("./pages/Contact"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// LanguageWrapper component
const LanguageWrapper = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith('/ar')) {
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    }
  }, [pathname]);
  return null;
};

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-deep-black flex flex-col items-center justify-center gap-4">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="text-white/30 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">Loading</p>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (!response.ok) {
          localStorage.removeItem('admin_token');
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
        setIsAuthorized(false);
      }
    };
    checkAuth();
  }, [location.pathname]);

  if (isAuthorized === null) return <PageLoader />;
  if (!isAuthorized) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <LanguageWrapper />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* English Routes */}
            <Route path="/" element={<Home lang="en" />} />
            <Route path="/join" element={<JoinUs lang="en" />} />
            <Route path="/contact" element={<Contact lang="en" />} />
            
            {/* Arabic Routes */}
            <Route path="/ar" element={<Home lang="ar" />} />
            <Route path="/ar/join" element={<JoinUs lang="ar" />} />
            <Route path="/ar/contact" element={<Contact lang="ar" />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/ar" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
