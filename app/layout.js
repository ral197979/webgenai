export const metadata = {
  title: 'WebGenAI',
  description: 'AI-powered website generator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
