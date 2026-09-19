import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/hook/UseCart'

function CartButton() {
    const { count } = useCart()

    return (
        <Link
            to="/cart"
            className="relative inline-flex items-center justify-center rounded-full border border-neutral-300 p-2.5 text-neutral-800 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-600 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-900"
            aria-label={`Shopping cart, ${count} item${count === 1 ? '' : 's'}`}
        >
            <ShoppingCart size={18} />
            {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8fa88f] px-1 text-[11px] font-semibold text-white">
                    {count}
                </span>
            )}
        </Link>
    )
}

export default CartButton