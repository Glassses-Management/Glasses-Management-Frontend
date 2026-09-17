import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, Package } from 'lucide-react'
import Field from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { composeValidators, required, minValue } from '@/utils/Validators'
import { useToast } from '@/hook/UseToast'
import { createInventory, updateInventory, getInventoryById } from '@/api/inventoryApi'
import { getProducts } from '@/api/productApi'

const EMPTY = {
  product_id: '',
  quantity: '',
  reorder_threshold: '',
}

export default function InventoryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success: toastSuccess, error: toastError } = useToast()
  const isEdit = Boolean(id) && id !== 'new'

  const [form, setForm] = useState({ ...EMPTY })
  const [errors, setErrors] = useState({})
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts({ page: 0, size: 200 })
        setProducts(data?.content || data || [])
      } catch {
        // silently fail
      }
    }
    loadProducts()
  }, [])

  useEffect(() => {
    if (isEdit && id) {
      const loadInventory = async () => {
        setLoading(true)
        try {
          const data = await getInventoryById(id)
          setForm({
            product_id: data.product_id || '',
            quantity: data.quantity ?? '',
            reorder_threshold: data.reorder_threshold ?? '',
          })
        } catch {
          toastError('Failed to load inventory.')
          navigate('/dashboard/inventory')
        } finally {
          setLoading(false)
        }
      }
      loadInventory()
    }
  }, [isEdit, id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextErrors = {
      product_id: composeValidators(required)(form.product_id) ? 'Please select a product' : '',
      quantity: composeValidators(required, minValue(0))(form.quantity),
      reorder_threshold: composeValidators(required, minValue(0))(form.reorder_threshold),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some((error) => error)) return

    setSubmitting(true)
    try {
      const payload = {
        product_id: Number(form.product_id),
        quantity: Number(form.quantity),
        reorder_threshold: Number(form.reorder_threshold),
      }

      if (isEdit) {
        await updateInventory(id, payload)
        toastSuccess('Inventory updated successfully.')
      } else {
        await createInventory(payload)
        toastSuccess('Inventory created successfully.')
      }
      navigate('/dashboard/inventory')
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Operation failed'
      toastError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const selectedProduct = products.find((p) => String(p.id) === String(form.product_id))

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-neutral-50">Loading inventory...</h1>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
        ))}
      </div>
    )
  }

  const pageTitle = isEdit ? 'Edit Inventory' : 'Add Inventory'
  const pageSubtitle = isEdit
    ? 'Update the stock level and reorder threshold.'
    : 'Create a new inventory entry for a product.'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
        <Link to="/dashboard/inventory" className="group inline-flex items-center gap-1.5 font-medium transition-colors hover:text-gray-700 dark:hover:text-neutral-100">
          Inventory
        </Link>
        <span aria-hidden="true" className="text-gray-300 dark:text-neutral-600">/</span>
        <span className="font-medium text-gray-900 dark:text-neutral-50">{pageTitle}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-50">{pageTitle}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">{pageSubtitle}</p>
      </div>

      <Card title={isEdit ? 'Edit Inventory' : 'New Inventory'} className="md:col-span-2">
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select
            label="Product"
            name="product_id"
            required
            options={[
              { value: '', label: 'Select a product...' },
              ...products.map((p) => ({
                value: p.id,
                label: `${p.sku} — ${p.brand} ${p.model}`,
              })),
            ]}
            value={form.product_id}
            onChange={handleChange}
            error={errors.product_id}
            placeholder="Select a product..."
          />
          {selectedProduct && (
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
              <Package size={16} />
              <span>{selectedProduct.brand} {selectedProduct.model} — SKU: {selectedProduct.sku}</span>
            </div>
          )}
          <Field
            label="Quantity"
            name="quantity"
            type="number"
            step="1"
            min="0"
            required
            value={form.quantity}
            onChange={handleChange}
            error={errors.quantity}
            placeholder="0"
            helper="Current stock count."
          />
          <Field
            label="Reorder Threshold"
            name="reorder_threshold"
            type="number"
            step="1"
            min="0"
            required
            value={form.reorder_threshold}
            onChange={handleChange}
            error={errors.reorder_threshold}
            placeholder="5"
            helper="Reorder when quantity drops to or below this value."
          />
        </div>
      </Card>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-gray-200/60 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-neutral-800 dark:bg-[#1c1c28]/80 md:-mx-6 md:px-6 md:py-5">
        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate('/dashboard/inventory')}>Cancel</Button>
          <Button type="submit" loading={submitting}>
            {isEdit ? 'Save Changes' : 'Create Inventory'}
          </Button>
        </div>
      </div>
    </form>
  )
}
