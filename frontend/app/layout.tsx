import './globals.css';

export const metadata = {
  title: 'Spotify 2024 Discovery | Elite',
  description: 'High-fidelity streaming analysis dashboard.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>

  )
}

