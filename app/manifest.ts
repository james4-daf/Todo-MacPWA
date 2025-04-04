import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Todo mac app PWA',
        short_name: 'Todo mac',
        description: 'A todo app Web App built with Next.js',
        start_url: '/?v=dev2',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
           {
               "src": "/icons/notepad-192x192.png",
               "sizes": "192x192",
               "type": "image/png"
           },
            {
                "src": "/icons/notepad-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
            },
       ]
    }
}