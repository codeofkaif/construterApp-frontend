import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { HomepageProvider } from './context/HomepageContext'
import { ServicesProvider } from './context/ServicesContext'
import { PortfolioProvider } from './context/PortfolioContext'
import { SiteContentProvider } from './context/SiteContentContext'
import { AppDataProvider } from './context/AppDataContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ServiceDetailPage from './pages/ServiceDetailPage'

export default function App() {
  return (
    <HomepageProvider>
      <ServicesProvider>
        <PortfolioProvider>
          <SiteContentProvider>
            <AppDataProvider>
              <AuthProvider>
                <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />

          {/* Client dashboard — authenticated users only (redirects to /login if not logged in) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin panel — ADMIN role required */}
          {/* Non-admin logged-in users → /dashboard  */}
          {/* Logged-out users → /login              */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
                </BrowserRouter>
              </AuthProvider>
            </AppDataProvider>
          </SiteContentProvider>
        </PortfolioProvider>
      </ServicesProvider>
    </HomepageProvider>
  )
}

