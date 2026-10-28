import type { Metadata } from 'next';
import '../style.css';

export const metadata: Metadata = {
  title: 'Tiệm Hoa Tích — Chuyện của hoa',
  description: 'Trò chơi visual novel kết hợp cắm hoa 2.5D giữa hai cõi sinh tử.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="game-container">{children}</body>
    </html>
  );
}
