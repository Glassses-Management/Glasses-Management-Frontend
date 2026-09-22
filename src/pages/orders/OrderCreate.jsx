import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getCustomers } from '@/api/customerApi'
import { getProducts } from '@/api/productApi'
import { createOrder } from '@/api/orderApi'
import { getPrescriptionsByCustomer } from '@/api/prescriptionApi'
import { useToast } from '@/hook/UseToast'
import Button from '@/components/ui/Button'
import CustomerPicker from '@/components/order/CustomerPicker'
import PrescriptionPicker from '@/components/order/PrescriptionPicker'
import OrderLineItems, { newRow } from '@/components/order/OrderLineItems'
import { formatCurrency } from '@/utils/format'

const toList = (data) => (Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [])

function Section({ title, description, children }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#1c1c28]">
      <h2 className="text-base font-semibold text-ink dark:text-neutral-50">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function OrderCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const prefill = location.state
  const prefillCustomerId = prefill?.customerId
  const prefillPrescriptionId = prefill?.prescriptionId
  const { success: toastSuccess, error: toastError } = useToast()

  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [prescriptions, setPrescriptions] = useState([])
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(false)
  const [prescriptionId, setPrescriptionId] = useState('')
  const [rows, setRows] = useState([newRow()])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [cust, prod] = await Promise.all([
          getCustomers({ page: 0, size: 100, sort: 'id,desc' }),
          getProducts({ page: 0, size: 100 }),
        ])
        if (cancelled) return
        const customerList = toList(cust)
        setCustomers(customerList)
        setProducts(toList(prod))
        if (prefillCustomerId) {
          const target = customerList.find((c) => c.id === Number(prefillCustomerId))
          if (target) {
            setSelectedCustomer(target)
            if (prefillPrescriptionId) setPrescriptionId(String(prefillPrescriptionId))
            try {
              const data = await getPrescriptionsByCustomer(target.id)
              if (!cancelled) setPrescriptions(toList(data))
            } catch {
              if (!cancelled) setPrescriptions([])
            }
          }
        }
      } catch (err) {
        console.error('OrderCreate: failed to load data:', err?.response?.status || err?.message || err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [prefillCustomerId, prefillPrescriptionId])

  const pickCustomer = async (customer) => {
    setSelectedCustomer(customer)
    setPrescriptionId('')
    setPrescriptions([])
    setRows([newRow()])
    if (!customer) return
    setPrescriptionsLoading(true)
    try {
      const data = await getPrescriptionsByCustomer(customer.id)
      setPrescriptions(toList(data))
    } catch {
      setPrescriptions([])
    } finally {
      setPrescriptionsLoading(false)
    }
  }

  const productById = (id) => products.find((p) => p.id === id)

  const grandTotal = rows.reduce((sum, row) => {
    const product = productById(row.productId)
    if (!product) return sum
    const lensPrice = row.lensPrice !== '' && row.lensPrice !== undefined ? Number(row.lensPrice) : 0
    return sum + (Number(product.sale_price) || 0) * Number(row.quantity) + lensPrice * Number(row.quantity)
  }, 0)

  const canSubmit = Boolean(selectedCustomer && prescriptionId && rows.some((row) => row.productId))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit || submitting) return

    const items = rows
      .filter((row) => row.productId)
      .map((row) => ({
        product_id: Number(row.productId),
        quantity: Number(row.quantity),
        len_type: row.lenType,
        len_coating: row.coating,
        len_index: String(row.lenIndex),
        len_price: row.lensPrice !== '' ? Number(row.lensPrice) : undefined,
      }))

    setSubmitting(true)
    try {
      await createOrder({
        customer_id: selectedCustomer.id,
        prescription_id: Number(prescriptionId),
        items,
      })
      toastSuccess('Order created successfully.')
      navigate('/dashboard/orders')
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create the order.'
      toastError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-500 dark:text-neutral-400">
        Loading order form...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
        <Link
          to="/dashboard/orders"
          className="group inline-flex items-center gap-1.5 font-medium transition-colors hover:text-gray-700 dark:hover:text-neutral-100"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Orders
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-gray-900 dark:text-neutral-50">New Order</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-50">Create Order</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          Pick a customer and their prescription, then add the products to dispense.
        </p>
      </div>

      <Section title="Customer Selection" description="The customer must have a prescription on record.">
        <CustomerPicker customers={customers} value={selectedCustomer} onChange={pickCustomer} />
      </Section>

      <Section
        title="Prescription Selection"
        description="Requires an on-file prescription — the order references it."
      >
        <PrescriptionPicker
          prescriptions={prescriptions}
          loading={prescriptionsLoading}
          value={prescriptionId}
          onChange={setPrescriptionId}
          customerName={selectedCustomer?.name}
        />
      </Section>

      <Section title="Add Products" description="Add one or more line items for this order.">
        <OrderLineItems products={products} rows={rows} onRowsChange={setRows} />
      </Section>

      <Section title="Order Summary">
        <div className="max-w-sm space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-neutral-400">Grand Total</span>
            <span className="text-lg font-bold text-gray-900 dark:text-neutral-100">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </Section>

      <div className="flex items-center justify-end gap-3">
        <Link
          to="/dashboard/orders"
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-white/5"
        >
          Cancel
        </Link>
        <Button type="submit" variant="primary" loading={submitting} disabled={!canSubmit}>
          Submit Order
        </Button>
        {!canSubmit && selectedCustomer && (
          <p className="max-w-[240px] text-right text-xs text-gray-400 dark:text-neutral-500">
            Select a prescription to enable the order.
          </p>
        )}
      </div>
    </form>
  )
}

export default OrderCreate