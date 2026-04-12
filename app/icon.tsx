import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#1A6640',
          borderRadius: '20%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* Shield shape */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '320px',
            height: '340px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
            position: 'relative',
          }}
        >
          {/* Cross */}
          <div
            style={{
              position: 'absolute',
              width: '80px',
              height: '200px',
              background: 'white',
              borderRadius: '12px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '200px',
              height: '80px',
              background: 'white',
              borderRadius: '12px',
            }}
          />
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  )
}
