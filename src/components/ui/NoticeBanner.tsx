'use client';


export interface NoticeBannerProps {
  message: string | null;
}

export function NoticeBanner({ message }: NoticeBannerProps) {
  if (!message) return null;

  return (
    <aside className="notice" role="status">
      {message}
    </aside>
  );
}
