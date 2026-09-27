// Where the clinic is, in one place.
//
// COORDINATES ARE A PLACEHOLDER. The value below is a rough midpoint of
// Monivong Boulevard, not your actual door. To get the real pin: open Google Maps,
// right-click your shop, and copy the first number pair. Then replace COORDINATES
// here and nothing else needs changing - both pages and the map read from here.
//
// A coordinate pair is used rather than the written address because a text query
// like "Monivong Boulevard" is ambiguous and will happily drop a pin on the wrong
// street.
export const COORDINATES = { lat: 11.552, lng: 104.921 }
export const ADDRESS_LINE = 'Monivong Boulevard, Phnom Penh'

const place = `${COORDINATES.lat},${COORDINATES.lng}`

// Opens Google Maps with a route already planned to the clinic. The old links
// pointed at https://maps.google.com, which just loads Google's home page - the
// "Get directions" button led nowhere.
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place}`
