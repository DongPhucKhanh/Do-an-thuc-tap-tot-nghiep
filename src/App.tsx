import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyActivities from './pages/MyActivities';
import CampaignDetail from './pages/CampaignDetail';
import AllCampaigns from './pages/AllCampaigns';
import Leaderboard from './pages/Leaderboard';
import CampaignList from './pages/CampaignList';
import Gallery from './pages/Gallery';
import TrainingPoint from './pages/TrainingPoint';
import TrainingRegulations from './pages/TrainingRegulations';
import Handbook from './pages/Handbook';
import NearestCampaigns from './pages/NearestCampaigns';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LatestNewsSection from './components/LatestNewsSection';
import NewsDetail from './pages/NewsDetail';
import NewsPage from './pages/NewsPage';
import PaymentReturn from './pages/PaymentReturn';
import Profile from './pages/Profile';
import DonationPage from './pages/DonationPage';
import ForgotPassword from './pages/ForgotPassword';
import { ThemeProvider } from './context/ThemeContext';

// ─── Page transition wrapper ──────────────────────
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// ─── Scroll to top on route change ───────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// ─── Inner app (needs useLocation) ───────────────
function AppInner() {
  const location = useLocation();

  // Pages that should NOT show the footer
  const noFooterRoutes = ['/login', '/register'];
  const showFooter = !noFooterRoutes.includes(location.pathname);

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />
      <Navbar />

      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/my-activities" element={<PageWrapper><MyActivities /></PageWrapper>} />
            <Route path="/leaderboard" element={<PageWrapper><Leaderboard /></PageWrapper>} />
            <Route path="/campaigns" element={<PageWrapper><CampaignList /></PageWrapper>} />
            <Route path="/campaign/:id" element={<PageWrapper><CampaignDetail /></PageWrapper>} />
            <Route path="/all-campaigns" element={<PageWrapper><AllCampaigns /></PageWrapper>} />
            <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
            <Route path="/training-point" element={<PageWrapper><TrainingPoint /></PageWrapper>} />
            <Route path="/training-regulations" element={<PageWrapper><TrainingRegulations /></PageWrapper>} />
            <Route path="/handbook" element={<PageWrapper><Handbook /></PageWrapper>} />
            <Route path="/nearest-campaigns" element={<PageWrapper><NearestCampaigns /></PageWrapper>} />
            <Route path="/latest-news" element={<PageWrapper><LatestNewsSection /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path="/news" element={<PageWrapper><NewsPage /></PageWrapper>} />
            <Route path="/news/:id" element={<PageWrapper><NewsDetail /></PageWrapper>} />
            <Route path="/payment-return" element={<PageWrapper><PaymentReturn /></PageWrapper>} />
            <Route path="/campaign/:id/donate" element={<DonationPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </AnimatePresence>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppInner />
      </Router>
    </ThemeProvider>
  );
}

export default App;