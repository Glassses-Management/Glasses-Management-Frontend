// Shared attachment picker for product images.
// Lives outside ProductImage.jsx so that file only exports components, which is
// what lets Vite's fast refresh swap it without a full reload.

const FILE_PATH_REGEX = /\.(jpg|jpeg|png|webp|avif)([?#]|$)/i

export function pickImage(attachments) {
  const list = Array.isArray(attachments) ? attachments : []
  // Prefer the newest attachment so a freshly uploaded picture replaces an old
  // one even if leftover duplicates still exist in the attachment list.
  return (
    [...list].reverse().find((a) => a?.fileType?.startsWith('image/') && a?.filePath) ||
    [...list].reverse().find((a) => a?.filePath && FILE_PATH_REGEX.test(a.filePath)) ||
    [...list].reverse().find((a) => a?.filePath) ||
    null
  )
}
