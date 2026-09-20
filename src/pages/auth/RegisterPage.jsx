import RegisterLeftPanel from '@/pages/auth/RegisterLeftPanel'
import RegisterFormPanel from '@/pages/auth/RegisterFormPanel'

function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mist via-mist-soft to-white font-sans text-neutral-800 antialiased transition-colors duration-300 dark:from-[#0E1A15] dark:via-[#111118] dark:to-[#0E1A15]">
      <div className="mx-auto grid min-h-screen max-w-5xl overflow-y-auto lg:grid-cols-2">
        <RegisterLeftPanel />
        <RegisterFormPanel />
      </div>
    </div>
  )
}

export default RegisterPage