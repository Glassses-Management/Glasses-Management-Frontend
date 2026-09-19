import { useState } from 'react'
import { ArrowLeft, Save, Plus } from 'lucide-react'
import { createProduct, updateProduct } from '@/api/productApi'
import { uploadAttachment, getAttachmentsByProduct, deleteAttachment } from '@/api/attachmentApi'
import ProductImageField from '@/components/product/ProductImageField'
import Button from '@/components/ui/Button'
import { useToast } from '@/hook/UseToast'

const EMPTY = {
  sku: '',
  model: '',
  brand: '',
  category: '',
  color: '',
  material: '',
  size: '',
  cost_price: '',
  sale_price: '',
  supplier_name: '',
  supplier_contact: '',
}

const FIELDS = [
  { name: 'model', label: 'Model', required: true },
  { name: 'brand', label: 'Brand', required: true },
  { name: 'category', label: 'Category', required: true },
  { name: 'sku', label: 'SKU', required: true },
  { name: 'color', label: 'Color' },
  { name: 'material', label: 'Material' },
  { name: 'size', label: 'Size' },
  { name: 'cost_price', label: 'Cost Price', type: 'number', min: '0.01', step: '0.01', required: true },
  { name: 'sale_price', label: 'Sale Price', type: 'number', min: '0.01', step: '0.01', required: true },
  { name: 'supplier_name', label: 'Supplier' },
  { name: 'supplier_contact', label: 'Supplier Contact' },
]

const INPUT_CLASS =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-[#1a1a2e] outline-none transition-colors focus:border-[#8fa88f] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#8fa88f]'

export default function ProductForm({ product, existingImage, onCancel, onSaved }) {
  const isEdit = !!product
  const toast = useToast()
  const [form, setForm] = useState(() => {
    if (!product) return { ...EMPTY }
    return {
      sku: product.sku || '',
      model: product.model || '',
      brand: product.brand || '',
      category: product.category || '',
      color: product.color || '',
      material: product.material || '',
      size: product.size || '',
      cost_price: product.cost_price ?? '',
      sale_price: product.sale_price ?? '',
      supplier_name: product.supplier_name || '',
      supplier_contact: product.supplier_contact || '',
    }
  })
  const [picture, setPicture] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  // Fields that need two columns on the 2-up grid get a full-width row instead.
  const gridClass = (name) => (name === 'supplier_contact' ? 'sm:col-span-2' : '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setError('')

    const missing = FIELDS.filter((f) => f.required && !String(form[f.name]).trim())
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.map((f) => f.label).join(', ')}`)
      return
    }

    const badPrice = FIELDS.find((f) => f.type === 'number' && String(form[f.name]).trim() && !(Number(form[f.name]) > 0))
    if (badPrice) {
      setError(`${badPrice.label} must be a number greater than 0.`)
      return
    }

    if (!isEdit && !picture) {
      setError('Please add a product picture.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {}
      FIELDS.forEach((f) => {
        payload[f.name] = form[f.name]
        if (f.type === 'number' && String(form[f.name]).trim()) payload[f.name] = Number(form[f.name])
      })

      const saved = isEdit ? await updateProduct(product.id, payload) : await createProduct(payload)

      if (picture) {
        if (isEdit) {
          // Replacing the photo: clear the old attachments first so the card
          // displays the newly uploaded image instead of the first old one.
          const atts = await getAttachmentsByProduct(saved.id).catch(() => [])
          const list = Array.isArray(atts) ? atts : Array.isArray(atts?.content) ? atts.content : []
          for (const att of list) {
            const id = att?.attachmentId ?? att?.id
            if (id) await deleteAttachment(id).catch(() => {})
          }
        }
        await uploadAttachment({ file: picture, productId: saved.id })
      }

      toast.success(isEdit ? 'Product updated successfully' : 'Product created successfully')
      onSaved?.(saved)
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Something went wrong'
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#1a1a2e] dark:text-neutral-500 dark:hover:bg-white/10 dark:hover:text-neutral-100"
          aria-label="Back to products"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-neutral-50">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
          <p className="text-sm text-gray-400 dark:text-neutral-500">
            {isEdit ? 'Update the details of your optical product.' : 'Create a new product for your inventory.'}
          </p>
        </div>
      </div>

      {/* Form + Image side by side on desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Product Information */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28] lg:col-span-2">
          <header className="border-b border-gray-100 px-5 py-4 dark:border-neutral-800">
            <h2 className="text-sm font-semibold text-[#1a1a2e] dark:text-neutral-100">Product Information</h2>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-neutral-500">Frame details and pricing.</p>
          </header>
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.name} className={gridClass(f.name)}>
                <label htmlFor={`product-${f.name}`} className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  {f.label}{f.required && <span className="ml-0.5 text-red-500">*</span>}
                </label>
                <input
                  id={`product-${f.name}`}
                  type={f.type || 'text'}
                  value={form[f.name]}
                  onChange={(e) => set(f.name, e.target.value)}
                  className={INPUT_CLASS}
                  {...(f.type === 'number' ? { min: f.min, step: f.step } : {})}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Product Image */}
        <section className="h-max rounded-2xl border border-gray-100 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28] lg:sticky lg:top-6">
          <header className="border-b border-gray-100 px-5 py-4 dark:border-neutral-800">
            <h2 className="text-sm font-semibold text-[#1a1a2e] dark:text-neutral-100">Product Image</h2>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-neutral-500">Upload a photo for the product catalog.</p>
          </header>
          <div className="p-5">
            <ProductImageField
              label="Picture"
              required={!isEdit}
              file={picture}
              previewUrl={existingImage}
              onFileChange={setPicture}
            />
          </div>
        </section>
      </div>

      {error && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={submitting} disabled={submitting} icon={isEdit ? <Save size={16} /> : <Plus size={16} />}>
          {isEdit ? 'Save Changes' : 'Add Product'}
        </Button>
      </div>
    </form>
  )
}