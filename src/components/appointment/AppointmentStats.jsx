import StatsCard from '@/components/ui/StatsCard'

function cardIcon({ tone }) {
    return (
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-300 ${tone}`}>
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        </span>
    )
}

function AppointmentStats({ stats }) {
    const cards = [
        { label: 'Total Appointments', value: stats.total, icon: cardIcon({ tone: 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300' }) },
        { label: 'Pending Review', value: stats.pending, icon: cardIcon({ tone: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300' }) },
        { label: 'Scheduled', value: stats.scheduled, icon: cardIcon({ tone: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300' }) },
        { label: 'Completed', value: stats.completed, icon: cardIcon({ tone: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-300' }) },
        { label: 'Cancelled', value: stats.cancelled, icon: cardIcon({ tone: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300' }) },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => (
                <StatsCard key={card.label} label={card.label} value={card.value} icon={card.icon} />
            ))}
        </div>
    )
}

export default AppointmentStats
