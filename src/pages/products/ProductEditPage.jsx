import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, SearchX } from 'lucide-react'
import ProductForm from '@/components/product/ProductForm'
import { getProductById } from '@/api/productApi'
import { getAttachmentsByProduct } from '@/api/attachmentApi'
import { pickImage } from '@/components/product/ProductImage'
import Button from '@/components/ui/Button'

export default function ProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const data = await getProductById(id)
        if (cancelled) return
        setProduct(data)

        const atts = await getAttachmentsByProduct(id).catch(() => [])
        const pick = pickImage(atts)
        if (!cancelled) setImage(pick?.filePath || '')
      } catch (err) {
        if (cancelled) return
        if (err?.response?.status === 404) setNotFound(true)
        else setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to load this product.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 w-64 animate-pulse rounded-xl bg-gray-100 dark:bg-neutral-800" />
        <div className="h-80 animate-pulse rounded-2xl bg-gray-100 dark:bg-neutral-800" />
        <div className="h-44 animate-pulse rounded-2xl bg-gray-100 dark:bg-neutral-800" />
      </div>
    )
  }

  if (notFound || error || !product) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm dark:border-neutral-800 dark:bg-[#1c1c28]">
        <SearchX size={40} className="mb-3 text-gray-300 dark:text-neutral-600" />
        <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
          {notFound ? 'Product not found.' : error || 'Product not found.'}
        </p>
        <Button variant="outline" className="mt-5" icon={<ArrowLeft size={16} />} onClick={() => navigate('/dashboard/products')}>
          Back to Products
        </Button>
      </div>
    )
  }

  return (
    <ProductForm
      product={product}
      existingImage={image}
      onCancel={() => navigate(-1)}
      onSaved={() => navigate('/dashboard/products')}
    />
  )
}