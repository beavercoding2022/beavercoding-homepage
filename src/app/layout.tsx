import SupabaseProvider from '@/src/app/supabase-provider';
import Navbar from '@/src/components/Navbar';
import '@mdxeditor/editor/style.css';
import './globals.css';
import { ThemeProvider } from '@/src/app/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BeaverCoding's Homepage",
  description:
    'BeaverCoding provides a simple and powerful solution for your business.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>
            <Navbar />
            <div className="max-w-screen-lg  px-6 mx-auto">
              <main
                id="skip"
                className="flex flex-col prose dark:prose-invert max-w-full min-h-screen"
              >
                {children}
              </main>
              <footer className="w-full border-t border-t-foreground/10 p-4 flex justify-center text-center text-xs">
                <p>Copyright © BeaverCoding {new Date().getFullYear()}</p>
              </footer>
            </div>
            <Toaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-CKFLC784QT" />
      <GoogleTagManager gtmId="G-CKFLC784QT" />
    </html>
  );
}
