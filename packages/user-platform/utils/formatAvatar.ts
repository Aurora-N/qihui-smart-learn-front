export const formatAvatarUrl = (url?: string | null) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  const config = useRuntimeConfig()
  return `${config.public.apiBase}${url}`
}
