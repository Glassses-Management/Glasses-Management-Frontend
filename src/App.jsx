import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Home from '@/pages/public/Home'
import About from '@/pages/public/About'
import Contact from '@/pages/public/Contact'
import NotFound from '@/pages/public/NotFound'
import { AuthProvider } from '@/context/AuthContext.jsx'
import { ToastProvider } from '@/context/ToastContext.jsx'



function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <DashboardLayout activeRoute="dashboard" onNavigate={(key) => console.log(key)}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* "*" matches any path that didn't match a route above */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
