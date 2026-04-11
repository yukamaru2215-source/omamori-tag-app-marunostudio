import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'おまもりタグ',
    short_name: 'おまもりタグ',
    description: 'NFCタグで子どもの医療情報を安全に管理',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F4F7F5',
    theme_color: '#1A6640',
    categories: ['health', 'medical'],
    icons: [
      {
        src: '/icon?size=192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon?size=512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
