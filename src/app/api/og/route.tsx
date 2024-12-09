import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          fontSize: 40,
          color: 'white',
          background: 'black',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_SITE_URL}/logo-transparent.png`}
          alt="logo"
          style={{ width: 100, height: 100 }}
        />
        <p>{text}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
