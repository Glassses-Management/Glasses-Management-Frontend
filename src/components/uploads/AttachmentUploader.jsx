import { useRef, useState } from 'react'
import { Trash2, UploadCloud, User } from 'lucide-react'
import { uploadAttachment } from '@/api/attachmentApi'
import Button from '@/components/ui/Button'
import { acceptsFile, formatBytes } from '@/utils/upload'

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024

function AttachmentUploader({
  userId,
  productId,
  currentImage = '',
  onUploaded,
  onRemove,
  onFileChange,
  label = 'Picture',
  accept = 'image/*',
  maxSize = DEFAULT_MAX_SIZE,
  required = false,
  error: externalError = '',
  defer = false,
  shape = 'card',
  hideLabel = false,
  placeholder = null,
}) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [dragging, setDragging] = useState(false)
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState('')

  const isCircle = shape === 'circle'
  const shown = preview || currentImage

  const handleFile = (f) => {
    if (!f) return
    if (!acceptsFile(f.type, accept)) {
      setError(`Unsupported file type. Accepted: ${accept}`)
      return
    }
    if (f.size > maxSize) {
      setError(`File is too large (${formatBytes(f.size)}). Max ${formatBytes(maxSize)}`)
      return
    }
    setError('')
    setFile(f)
    if (defer) onFileChange?.(f)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(f)
  }

  const handleChange = (e) => {
    const f = e.target.files?.[0] || null
    e.target.value = ''
    if (f) handleFile(f)
  }

  const clear = () => {
    setFile(null)
    setPreview('')
    if (inputRef.current) inputRef.current.value = ''
    if (defer) onFileChange?.(null)
  }

  const handleUpload = async () => {
    if (!file || saving) return
    setSaving(true)
    try {
      const attachment = await uploadAttachment({ file, userId, productId })
      onUploaded?.(attachment)
      clear()
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Upload failed')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async () => {
    if (removing) return
    setRemoving(true)
    try {
      await onRemove?.()
      setError('')
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Remove failed')
    } finally {
      setRemoving(false)
    }
  }

  const removeClick = file ? clear : onRemove ? handleRemove : clear
  const removeLabel = file ? 'Remove' : onRemove ? 'Delete' : 'Clear'

  const targetClass = isCircle
    ? `relative size-16 shrink-0 cursor-pointer overflow-hidden rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#8fa88f] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 ${dragging ? 'ring-2 ring-[#8fa88f]' : ''}`
    : `relative flex w-full cursor-pointer flex-col items-center justify-center gap-2.5 overflow-hidden rounded-2xl border-2 border-dashed text-center text-gray-400 transition-all outline-none aspect-[4/3] focus-visible:ring-2 focus-visible:ring-[#8fa88f] dark:text-neutral-500 ${
        dragging
          ? 'border-[#8fa88f] bg-[#8fa88f]/10'
          : 'border-gray-200 bg-gray-50 hover:border-[#8fa88f] hover:bg-[#8fa88f]/5 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-[#8fa88f]'
      }`

  return (
    <div>
      {!hideLabel && (
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-400">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFile(e.dataTransfer?.files?.[0])
        }}
        className={targetClass}
      >
        {shown ? (
          <img
            src={shown}
            alt="Upload preview"
            className={isCircle ? 'h-full w-full object-cover' : 'absolute inset-0 h-full w-full object-cover'}
          />
        ) : isCircle ? (
          placeholder || (
            <span className="flex h-full w-full items-center justify-center bg-neutral-200 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
              <User size={24} />
            </span>
          )
        ) : (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-colors dark:bg-neutral-700 dark:text-neutral-300">
              {saving ? (
                <span className="size-5 animate-spin rounded-full border-2 border-[#8fa88f] border-t-transparent" />
              ) : (
                <UploadCloud size={22} />
              )}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-neutral-300">
              {saving ? 'Uploading...' : 'Drag & drop or click to upload'}
            </span>
            <span className="text-xs text-gray-400 dark:text-neutral-500">
              {accept === 'image/*' ? 'JPG, PNG or WebP' : accept} · up to {formatBytes(maxSize)}
            </span>
          </>
        )}
      </div>

      {(file || shown) && (
        <div className={`mt-2 flex items-center justify-between gap-2`}>
          {(file || !isCircle) && (
            <span className="truncate text-xs text-gray-500 dark:text-neutral-400">
              {file ? `${file.name} (${formatBytes(file.size)})` : 'Current picture'}
            </span>
          )}
          <div className="flex shrink-0 items-center gap-2">
            {!defer && file && (
              <Button
                size="sm"
                variant="forest"
                loading={saving}
                onClick={handleUpload}
                icon={<UploadCloud size={12} />}
              >
                Upload
              </Button>
            )}
            <button
              type="button"
              onClick={removeClick}
              disabled={removing || saving}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {removing ? (
                <span className="size-3 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
              ) : (
                <Trash2 size={12} />
              )}
              {removeLabel}
            </button>
          </div>
        </div>
      )}

      {(error || externalError) && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error || externalError}</p>
      )}
    </div>
  )
}

export default AttachmentUploader
