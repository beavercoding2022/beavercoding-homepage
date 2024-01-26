import SupabaseProvider from '@/src/app/supabase-provider';
import Navbar from '@/src/components/Navbar';
import '@mdxeditor/editor/style.css';
import './globals.css';
import { ThemeProvider } from '@/src/app/theme-provider';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: '비버코딩 홈페이지',
  description:
    '비버코딩은 비즈니스를 위한 가장 단순하고 강력한 해결책을 제시합니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="text-foreground">
        <ThemeProvider defaultTheme="dark" disableTransitionOnChange>
          <SupabaseProvider>
            <Navbar />
            <div className="max-w-screen-lg p-6 mx-auto">
              <main
                id="skip"
                className="flex flex-col prose dark:prose-invert max-w-full"
              >
                {children}
              </main>
              <footer className="w-full border-t border-t-foreground/10 p-4 flex justify-center text-center text-xs">
                <p>Copyright © BeaverCoding {new Date().getFullYear()}</p>
              </footer>
            </div>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
