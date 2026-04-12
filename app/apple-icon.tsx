import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#1A6640',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Shield shape */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '128px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '30px',
              height: '76px',
              background: 'white',
              borderRadius: '6px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '76px',
              height: '30px',
              background: 'white',
              borderRadius: '6px',
            }}
          />
        </div>
      </div>
    ),
    { width: 180, height: 180 }
  )
}
