import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import MemberDirectory from './pages/MemberDirectory';
import Announcements from './pages/Announcements';
import Blog from './pages/Blog';
import Events from './pages/Events';
import HallOfFame from './pages/HallOfFame';
import Support from './pages/Support';
import Business from './pages/Business';
import Newsletter from './pages/Newsletter';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import PendingApproval from './pages/PendingApproval';
import ForgotPassword from './components/Auth/ForgotPassword';
import NotFound from './pages/NotFound';
import AdminSetup from './pages/AdminSetup';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AddBusiness from './pages/AddBusiness';

// Scroll to top component with smooth behavior
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use smooth scrolling behavior
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

function App() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                <Route path="/blog" element={<Blog />} />
                <Route path="/events" element={<Events />} />
                <Route path="/hall-of-fame" element={<HallOfFame />} />
                <Route path="/support" element={<Support />} />
                <Route path="/business" element={<Business />} />
                <Route path="/newsletter" element={<Newsletter />} />
                <Route path="/pending-approval" element={<PendingApproval />} />
                
                <Route element={<PrivateRoute />}>
                  <Route path="/directory" element={<MemberDirectory />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/add-business" element={<AddBusiness />} />
                </Route>
                
                <Route element={<AdminRoute />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>

                {isDevelopment && (
                  <Route path="/admin-setup" element={<AdminSetup />} />
                )}
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;