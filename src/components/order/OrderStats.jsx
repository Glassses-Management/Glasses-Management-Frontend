import StatsCard from '@/components/ui/StatsCard'

function cardIcon({ tone }) {
    return (
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-300 ${tone}`}>
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="8" y="2" width="8" height="4" rx="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <path d="M9 12h6M9 16h6" />
            </svg>
        </span>
    )
}

function OrderStats({ stats }) {
    const cards = [
        { label: 'Total Orders', value: stats.total, icon: cardIcon({ tone: 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300' }) },
        { label: 'Pending', value: stats.pending, icon: cardIcon({ tone: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300' }) },
        { label: 'Processing', value: stats.processing, icon: cardIcon({ tone: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300' }) },
        { label: 'Ready', value: stats.ready, icon: cardIcon({ tone: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300' }) },
        { label: 'Completed', value: stats.completed, icon: cardIcon({ tone: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-300' }) },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => (
                <StatsCard key={card.label} label={card.label} value={card.value} icon={card.icon} />
            ))}
        </div>
    )
}

export default OrderStats