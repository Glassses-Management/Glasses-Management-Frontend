import { useNavigate } from 'react-router-dom'
import ProductForm from '@/components/product/ProductForm'

export default function ProductCreatePage() {
  const navigate = useNavigate()

  return (
    <ProductForm
      onCancel={() => navigate(-1)}
      onSaved={() => navigate('/dashboard/products')}
    />
  )
}