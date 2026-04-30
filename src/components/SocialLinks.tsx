import { Globe, Facebook, Instagram, Music, Youtube, Apple } from 'lucide-react';
import type { Band } from '@/types';

interface SocialLinksProps {
  band: Band;
}

const LINKS: { key: keyof Band; label: string; Icon: typeof Globe }[] = [
  { key: 'web', label: 'Website', Icon: Globe },
  { key: 'fb', label: 'Facebook', Icon: Facebook },
  { key: 'insta', label: 'Instagram', Icon: Instagram },
  { key: 'spotify', label: 'Spotify', Icon: Music },
  { key: 'apple', label: 'Apple Music', Icon: Apple },
  { key: 'yt', label: 'YouTube', Icon: Youtube }
];

export default function SocialLinks({ band }: SocialLinksProps) {
  const visible = LINKS.filter((l) => band[l.key]);
  if (visible.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={band[key] as string}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary px-3 py-1.5 text-sm"
        >
          <Icon size={14} />
          {label}
        </a>
      ))}
    </div>
  );
}
