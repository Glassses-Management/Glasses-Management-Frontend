import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section>
      <h1 className="mb-4 text-3xl font-bold dark:text-neutral-50">404 - Page Not Found</h1>
      <p className="dark:text-neutral-400">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="text-violet-600 hover:underline dark:text-violet-400">
        Go back home
      </Link>
    </section>
  )
}

export default NotFound
