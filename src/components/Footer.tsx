import { PRIVACY_URL } from '@/config';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-river-700/50 py-4 text-sm text-river-300">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
        <span className="text-xs text-river-400">© Rhythm of the River</span>
        <a
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-sun-300"
        >
          Privacy Notice
        </a>
      </div>
    </footer>
  );
}
