import { Routes, Route } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Home from '@/pages/public/Home'
import About from '@/pages/public/About'
import Contact from '@/pages/public/Contact'
import NotFound from '@/pages/public/NotFound'

function App() {
  return (
    <>
      {/* Navbar sits outside Routes so it stays visible on every page */}
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 pt-6 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* "*" matches any path that didn't match a route above */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default App
