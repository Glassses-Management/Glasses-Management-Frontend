import { ArrowUpRight, Baby, Glasses, Monitor, Sparkles, Sun } from 'lucide-react'

const CATEGORIES = [
  { icon: Glasses, title: 'Prescription Glasses', text: 'Single-vision, biconvex and multifocal RX lenses.' },
  { icon: Sparkles, title: 'Titanium Frames', text: 'Featherlight 1.2mm edge titanium, hand-polished.' },
  { icon: Sun, title: 'Sunglasses', text: 'Polarized UV400 lenses with durable tenon hinges.' },
  { icon: Monitor, title: 'Blue-Light Digital', text: 'Comfort lenses that shield eyes during screen time.' },
  { icon: Baby, title: "Kids' Eyewear", text: 'Flex hinges and shatter-safe lenses for active days.' },
]

export default function HomeCategories() {
  return (
    <section className="bg-mist py-16 transition-colors duration-300 md:py-20 dark:bg-[#121F18]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest dark:text-leaf">
              Specialized Eyewear Categories
            </p>
            <h2 className="mt-3 font-sans font-semibold text-3xl text-neutral-900 md:text-4xl dark:text-neutral-50">
              Find the frame for every vision need
            </h2>
          </div>
          <p className="max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
            Each category is stocked by our clinical buyers and glazed in-house to your exact prescription.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group relative rounded-2xl bg-white p-5 ring-1 ring-edge shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-[#16271F] dark:ring-neutral-800"
            >
              <ArrowUpRight
                size={16}
                className="absolute right-4 top-4 text-neutral-300 transition-colors group-hover:text-forest dark:group-hover:text-leaf"
              />
              <span className="flex size-11 items-center justify-center rounded-lg bg-mist text-forest dark:bg-[#1E332B] dark:text-leaf">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-sans text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}