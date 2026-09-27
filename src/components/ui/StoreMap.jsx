import { COORDINATES } from '@/components/ui/storeLocation'

const place = `${COORDINATES.lat},${COORDINATES.lng}`

// With a key: the Maps Embed API, which is what the Google Cloud walkthrough sets
// up. Without one: the plain keyless embed, which is a real, interactive Google
// map too - so the page is never broken while the key is still being created.
const key = import.meta.env.VITE_GOOGLE_MAPS_KEY

const src = key
  ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${place}&zoom=16&language=en&region=KH`
  : `https://maps.google.com/maps?q=${place}&z=16&hl=en&output=embed`

// The clinic map, shown on the Contact and About pages.
//
// A plain <iframe> rather than the Maps JavaScript API: there is a single fixed
// location and nothing to script, so pulling in a JS SDK would be a lot of weight
// for no benefit. The coordinates live in ./storeLocation.
function StoreMap({ className = '', title = 'Map showing the clinic location' }) {
  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className={`w-full border-0 ${className}`}
    />
  )
}

export default StoreMap
