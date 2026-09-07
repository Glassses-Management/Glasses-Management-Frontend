import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Search, Plus, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/format'
import customerData from '@/mockData/mockCustomers.json'
import inventoryData from '@/mockData/mockInventory.json'

const LENS_TYPES = ['Single Vision', 'Progressive', 'Bifocal', 'Standard']
const COATINGS = ['Standard', 'Anti-Glare', 'Blue Light']
const LENS_INDEXES = [1.5, 1.6, 1.67, 1.74]

function Section({ title, description, children }) {
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            <div className="mt-4">{children}</div>
        </section>
    )
}

function newRow() {
    return {
        rowId: Date.now() + Math.random(),
        productId: '',
        quantity: 1,
        lenType: 'Single Vision',
        coating: 'Standard',
        lenIndex: 1.6,
    }
}

function OrderCreate() {
    const navigate = useNavigate()
    const customers = customerData.customers
    const products = inventoryData.items

    const [customerQuery, setCustomerQuery] = useState('')
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [prescriptionId, setPrescriptionId] = useState('')
    const [rows, setRows] = useState([newRow()])

    const filteredCustomers = useMemo(() => {
        const q = customerQuery.trim().toLowerCase()
        if (!q) return customers
        return customers.filter(
            (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q),
        )
    }, [customers, customerQuery])

    const pickCustomer = (customer) => {
        setSelectedCustomer(customer)
        setPrescriptionId('')
        setCustomerQuery('')
    }

    const updateRow = (rowId, patch) => {
        setRows((prev) => prev.map((r) => (r.rowId === rowId ? { ...r, ...patch } : r)))
    }

    const addRow = () => setRows((prev) => [...prev, newRow()])
    const removeRow = (rowId) => setRows((prev) => (prev.length === 1 ? prev : prev.filter((r) => r.rowId !== rowId)))

    const productById = (id) => products.find((p) => p.id === id)

    const subtotal = rows.reduce((sum, row) => {
        const product = productById(row.productId)
        if (!product) return sum
        return sum + (product.sale_price || 0) * row.quantity
    }, 0)

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate('/orders')
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
                <Link to="/orders" className="inline-flex items-center gap-1 hover:text-gray-700">
                    <ArrowLeft size={16} />
                    Orders
                </Link>
                <span aria-hidden="true">/</span>
                <span className="font-medium text-gray-900">New Order</span>
            </nav>

            <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Order</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Select a customer, prescription, and add the products for a new dispensing order.
                </p>
            </div>

            {/* Section 1: Customer Selection */}
            <Section title="Customer Selection" description="Search and select the customer for this order.">
                {!selectedCustomer ? (
                    <div>
                        <div className="relative max-w-md">
                            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={customerQuery}
                                onChange={(e) => setCustomerQuery(e.target.value)}
                                placeholder="Search customer by name or phone..."
                                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border border-gray-100">
                            {filteredCustomers.map((c) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => pickCustomer(c)}
                                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50"
                                >
                                    <span className="font-medium text-gray-900">{c.name}</span>
                                    <span className="text-xs text-gray-500">{c.phone}</span>
                                </button>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <p className="px-4 py-3 text-sm text-gray-500">No customers found.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex max-w-md items-center justify-between rounded-lg border border-gray-200 p-4">
                        <div>
                            <p className="font-medium text-gray-900">{selectedCustomer.name}</p>
                            <p className="text-xs text-gray-500">{selectedCustomer.phone} · {selectedCustomer.email}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedCustomer(null)}
                            className="rounded-lg px-3 py-1.5 text-sm text-blue-600 hover:bg-gray-50"
                        >
                            Change
                        </button>
                    </div>
                )}
            </Section>

            {/* Section 2: Prescription Selection */}
            <Section title="Prescription Selection" description="Choose a valid prescription for this customer.">
                {!selectedCustomer ? (
                    <p className="text-sm text-gray-400">Select a customer first to see their prescriptions.</p>
                ) : selectedCustomer.prescriptions.length === 0 ? (
                    <p className="text-sm text-gray-400">This customer has no prescriptions on record.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {selectedCustomer.prescriptions.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => setPrescriptionId(p.id)}
                                className={`flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${Number(prescriptionId) === p.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div>
                                    <p className="font-medium text-gray-900">Prescription #{p.id}</p>
                                    <p className="text-xs text-gray-500">Valid from {formatDate(p.prescription_date)}</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        OD {p.od_sphere} / OS {p.os_sphere}
                                    </p>
                                </div>
                                {Number(prescriptionId) === p.id && (
                                    <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </Section>

            {/* Section 3: Add Multiple Products */}
            <Section title="Add Products" description="Add one or more line items for this order.">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
                                <th className="pb-3 pr-3 font-medium">Product</th>
                                <th className="pb-3 pr-3 font-medium">Quantity</th>
                                <th className="pb-3 pr-3 font-medium">Lens Type</th>
                                <th className="pb-3 pr-3 font-medium">Coating</th>
                                <th className="pb-3 pr-3 font-medium">Lens Index</th>
                                <th className="pb-3 pr-3 font-medium">Unit Price</th>
                                <th className="pb-3 pr-3 font-medium">Total</th>
                                <th className="pb-3 font-medium" />
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => {
                                const product = productById(row.productId)
                                const total = product ? (product.sale_price || 0) * row.quantity : 0
                                return (
                                    <tr key={row.rowId} className="border-b border-gray-50">
                                        <td className="py-3 pr-3">
                                            <select
                                                value={row.productId}
                                                onChange={(e) => updateRow(row.rowId, { productId: Number(e.target.value) })}
                                                className="w-44 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                            >
                                                <option value="">Select product</option>
                                                {products.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.brand} {p.model} ({p.sku})
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-3 pr-3">
                                            <input
                                                type="number"
                                                min="1"
                                                value={row.quantity}
                                                onChange={(e) => updateRow(row.rowId, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                                                className="w-16 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                            />
                                        </td>
                                        <td className="py-3 pr-3">
                                            <select
                                                value={row.lenType}
                                                onChange={(e) => updateRow(row.rowId, { lenType: e.target.value })}
                                                className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                            >
                                                {LENS_TYPES.map((t) => <option key={t}>{t}</option>)}
                                            </select>
                                        </td>
                                        <td className="py-3 pr-3">
                                            <select
                                                value={row.coating}
                                                onChange={(e) => updateRow(row.rowId, { coating: e.target.value })}
                                                className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                            >
                                                {COATINGS.map((c) => <option key={c}>{c}</option>)}
                                            </select>
                                        </td>
                                        <td className="py-3 pr-3">
                                            <select
                                                value={row.lenIndex}
                                                onChange={(e) => updateRow(row.rowId, { lenIndex: Number(e.target.value) })}
                                                className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                            >
                                                {LENS_INDEXES.map((i) => <option key={i} value={i}>{i.toFixed(2)}</option>)}
                                            </select>
                                        </td>
                                        <td className="py-3 pr-3 text-gray-900">
                                            {product ? formatCurrency(product.sale_price) : '—'}
                                        </td>
                                        <td className="py-3 pr-3 font-medium text-gray-900">{formatCurrency(total)}</td>
                                        <td className="py-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => removeRow(row.rowId)}
                                                disabled={rows.length === 1}
                                                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                aria-label="Remove row"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <button
                    type="button"
                    onClick={addRow}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                    <Plus size={16} />
                    Add Row
                </button>
            </Section>

            {/* Section 4: Order Summary */}
            <Section title="Order Summary">
                <div className="max-w-sm space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-100 pt-2">
                        <span className="font-medium text-gray-900">Grand Total</span>
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(subtotal)}</span>
                    </div>
                </div>
            </Section>

            {/* Section 5: Submit */}
            <div className="flex items-center justify-end gap-3">
                <Link
                    to="/orders"
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={!selectedCustomer}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Submit Order
                </button>
            </div>
        </form>
    )
}

export default OrderCreate