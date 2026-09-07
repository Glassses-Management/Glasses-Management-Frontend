// Reusable box so pages don't repeat the same border/padding markup
function Card({ title, children }) {
  return (
    <div className="mt-4 rounded-lg border border-gray-200 p-5 text-left transition-colors duration-300 dark:border-neutral-800 dark:bg-[#1c1c28]">
      {title && <h3 className="mb-2 font-semibold dark:text-neutral-100">{title}</h3>}
      <div>{children}</div>
    </div>
  )
}

export default Card
