import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'

function ProductImageField({ label, required, file, onFileChange, error }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState('')

  const handleChange = (e) => {
    const f = e.target.files?.[0] || null
    onFileChange(f)
    if (f) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(f)
    } else {
      setPreview('')
    }
  }

  const clear = () => {
    onFileChange(null)
    setPreview('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-400">
        {label}{required && ' *'}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-36 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-[#8fa88f] hover:bg-[#8fa88f]/5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500 dark:hover:border-[#8fa88f]"
      >
        {preview ? (
          <img src={preview} alt="Picture preview" className="h-full w-full rounded-xl object-cover" />
        ) : (
          <>
            <ImagePlus size={24} />
            <span className="text-xs">Click to choose a picture</span>
          </>
        )}
      </button>
      {file && (
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-gray-500 dark:text-neutral-400">{file.name}</span>
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 dark:text-red-400"
          >
            <X size={12} />
            Remove
          </button>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

export default ProductImageField