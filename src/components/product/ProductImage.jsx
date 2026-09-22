import { useState } from 'react'

// Reusable product image with a glasses fallback when there is no photo yet.
const FILE_PATH_REGEX = /\.(jpg|jpeg|png|webp|avif)([?#]|$)/i

export function pickImage(attachments) {
  const list = Array.isArray(attachments) ? attachments : []
  // Prefer the newest attachment so a freshly uploaded picture replaces an old
  // one even if leftover duplicates still exist in the attachment list.
  return (
    [...list].reverse().find((a) => a?.fileType?.startsWith('image/') && a?.filePath) ||
    [...list].reverse().find((a) => a?.filePath && FILE_PATH_REGEX.test(a.filePath)) ||
    [...list].reverse().find((a) => a?.filePath) ||
    null
  )
}

export function GlassesFallback({ className = '' }) {
  return (
    <div className={`flex items-center justify-center bg-neutral-100 dark:bg-neutral-800/80 ${className}`}>
      <svg
        className="h-16 w-16 text-neutral-300 transition-colors dark:text-neutral-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="6" cy="15" r="4" />
        <circle cx="18" cy="15" r="4" />
        <path d="M14 15a2 2 0 0 0-4 0" />
        <path d="M2.5 13L5 7c.7-1.3 2-2 3.5-2h7c1.5 0 2.8.7 3.5 2l2.5 6" />
      </svg>
    </div>
  )
}

function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)
  const [prevSrc, setPrevSrc] = useState(src)

  if (prevSrc !== src) {
    setPrevSrc(src)
    setFailed(false)
  }

  const showFallback = !src || failed

  return (
    <div className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-800/80 ${className}`}>
      {showFallback ? (
        <GlassesFallback className="absolute inset-0 h-full w-full" />
      ) : (
        <img
          src={src}
          alt={alt || ''}
          onError={() => setFailed(true)}
          className={`${/\bobject-contain\b/.test(className) ? 'object-contain' : 'object-cover'} h-full w-full`}
        />
      )}
    </div>
  )
}

export default ProductImage
