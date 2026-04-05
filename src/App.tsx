import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { Header } from './components/shared/Header'
import { ProtectedRoute } from './components/shared/ProtectedRoute'
import { ToastContainer } from './components/shared/ToastContainer'
import { Landing } from './pages/Landing'
import { Login } from './pages/auth/Login'
import { VerifyEmail } from './pages/auth/VerifyEmail'
import { PlayerSignup } from './pages/player/Signup'
import { CoachSignup } from './pages/coach/Signup'
import { CoachDashboard } from './pages/coach/Dashboard'
import { CoachProfile } from './pages/coach/Profile'
import { CoachBookings } from './pages/coach/Bookings'
import { PlayerSearch } from './pages/player/Search'
import { CoachDetail } from './pages/player/CoachDetail'
import { PlayerBookings } from './pages/player/Bookings'
import { PlayerSettings } from './pages/player/Settings'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { NotFound } from './pages/NotFound'
import { Footer } from './components/shared/Footer'

const noHeaderRoutes = ['/coach/signup', '/coach/dashboard', '/coach/bookings', '/coach/profile', '/coach/settings']
const noFooterRoutes = ['/coach/signup', '/coach/dashboard', '/coach/bookings', '/coach/profile', '/coach/settings', '/login', '/player/signup']

function AppLayout() {
  const location = useLocation()
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage)
  const showHeader = !noHeaderRoutes.some((r) => location.pathname.startsWith(r))
  const showFooter = !noFooterRoutes.some((r) => location.pathname.startsWith(r))

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/player/signup" element={<PlayerSignup />} />
        <Route path="/coach/signup" element={<CoachSignup />} />
        <Route path="/search" element={<PlayerSearch />} />
        <Route path="/coach/:id" element={<CoachDetail />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Protected: Coach only */}
        <Route element={<ProtectedRoute requiredRole="COACH" />}>
          <Route path="/coach/dashboard" element={<CoachDashboard />} />
          <Route path="/coach/profile" element={<CoachProfile />} />
          <Route path="/coach/bookings" element={<CoachBookings />} />
          <Route path="/coach/settings" element={<CoachProfile />} />
        </Route>

        {/* Protected: any logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/player/bookings" element={<PlayerBookings />} />
          <Route path="/player/settings" element={<PlayerSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      {showFooter && <Footer />}
      <ToastContainer />
    </>
  )
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}

export default App
