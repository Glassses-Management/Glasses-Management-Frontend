import { useRef, useState } from 'react'
import { ImagePlus, X, UploadCloud } from 'lucide-react'

function formatBytes(bytes) {
  if (!bytes) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

function ProductImageField({ label, required, file, onFileChange, error, previewUrl }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState('')
  const [dragging, setDragging] = useState(false)

  const handleFile = (f) => {
    if (!f) return
    onFileChange(f)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(f)
  }

  const handleChange = (e) => {
    const f = e.target.files?.[0] || null
    if (f) {
      handleFile(f)
    } else {
      onFileChange(null)
      setPreview('')
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer?.files?.[0])
  }

  const clear = () => {
    onFileChange(null)
    setPreview('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const shown = preview || previewUrl
  const dropzoneClass =
    'relative flex w-full flex-col items-center justify-center gap-2.5 overflow-hidden rounded-2xl border-2 border-dashed text-gray-400 transition-all dark:text-neutral-500 ' +
    (dragging
      ? 'border-[#8fa88f] bg-[#8fa88f]/10 dark:border-[#8fa88f] dark:bg-[#8fa88f]/10'
      : 'border-gray-200 bg-gray-50 hover:border-[#8fa88f] hover:bg-[#8fa88f]/5 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-[#8fa88f]')

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-400">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`${dropzoneClass} aspect-[4/3] w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#8fa88f]`}
      >
        {shown ? (
          <img src={shown} alt="Picture preview" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-colors dark:bg-neutral-700 dark:text-neutral-300">
              <UploadCloud size={22} />
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-neutral-300">
              Drag & drop or click to upload
            </span>
            <span className="text-xs text-gray-400 dark:text-neutral-500">JPG, PNG or WebP · up to 10MB</span>
          </>
        )}
      </div>

      {/* Preview caption with actions */}
      {(shown) && (
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-gray-500 dark:text-neutral-400">
            {file?.name ? `${file.name} (${formatBytes(file.size)})` : 'Current picture'}
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-white/5"
            >
              <ImagePlus size={12} />
              Change
            </button>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <X size={12} />
              Remove
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

export default ProductImageField