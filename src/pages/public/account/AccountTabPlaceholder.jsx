import AccountCard from '@/pages/public/account/AccountCard'

function AccountTabPlaceholder({ icon: Icon, title, blurb }) {
  return (
    <AccountCard className="mt-6 p-10">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-forest/10 text-forest dark:bg-leaf/10 dark:text-leaf">
          <Icon size={24} />
        </span>
        <h2 className="mt-4 font-sans text-lg font-semibold text-neutral-900 dark:text-neutral-50">{title}</h2>
        <p className="mt-2 max-w-md text-sm text-neutral-500 dark:text-neutral-400">{blurb}</p>
      </div>
    </AccountCard>
  )
}

export default AccountTabPlaceholder