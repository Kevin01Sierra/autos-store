/** Convierte un texto en un identificador legible para URL: "Mazda CX-30" -> "mazda-cx-30". */
export const slugify = (...parts: string[]): string =>
  parts
    .join(' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
