import { useNavigate } from 'react-router-dom'
import { Stethoscope, ShoppingCart, ArrowRight } from 'lucide-react'
import { useCustomers } from '@/hook/UseCustomer'

function RequestEntryPage() {
    const navigate = useNavigate()
    const { customers } = useCustomers()

    const customerOptions = [
        { value: '', label: 'Select your profile...' },
        ...customers.map((c) => ({ value: c.id, label: c.name })),
    ]

    const handleSelect = (type) => {
        const selected = customerOptions.find((o) => o.value !== '')
        if (selected) {
            navigate(`/dashboard/requests/${type}`)
        } else {
            alert('Please select your profile first')
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">Request an Exam or Product</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    Choose the type of request you'd like to submit.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <button
                    type="button"
                    onClick={() => handleSelect('exam')}
                    className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-8 text-center transition-colors duration-300 hover:border-violet-400 hover:bg-violet-50 dark:border-neutral-800 dark:bg-[#1c1c28] dark:hover:border-violet-400 dark:hover:bg-violet-900/20"
                >
                    <div className="flex size-20 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                        <Stethoscope size={36} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">Eye Exam Request</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                            Request an eye examination with your existing prescription on file.
                        </p>
                    </div>
                    <ArrowRight size={20} className="mt-2 text-violet-500" />
                </button>

                <button
                    type="button"
                    onClick={() => handleSelect('product')}
                    className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-8 text-center transition-colors duration-300 hover:border-violet-400 hover:bg-violet-50 dark:border-neutral-800 dark:bg-[#1c1c28] dark:hover:border-violet-400 dark:hover:bg-violet-900/20"
                >
                    <div className="flex size-20 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                        <ShoppingCart size={36} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">Product Request</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                            Request to purchase glasses, lenses, or accessories.
                        </p>
                    </div>
                    <ArrowRight size={20} className="mt-2 text-violet-500" />
                </button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-[#1c1c28]">
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                    <span className="font-medium">Note:</span> Requests are reviewed by staff before being processed.
                    You'll need to be logged in with a customer profile to submit a request.
                </p>
            </div>
        </div>
    )
}

export default RequestEntryPage