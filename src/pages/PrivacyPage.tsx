import { FESTIVAL } from '@/config';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="font-display text-4xl tracking-wider text-river-50 sm:text-5xl">
          Privacy Notice
        </h1>
        <p className="mt-2 text-sm text-river-400">
          Last updated: April 2026
        </p>
      </header>

      <section className="card space-y-3 p-5 text-river-100">
        <p>
          {FESTIVAL.name} is a small, volunteer-run festival. This site is
          designed to share schedules and announcements — not to collect
          information about you. The notes below explain what does happen
          behind the scenes.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-2xl tracking-wide text-sun-300">
          What we don't do
        </h2>
        <ul className="list-disc space-y-1 pl-6 text-river-200">
          <li>No accounts or sign-ups for festival-goers.</li>
          <li>No third-party advertising trackers.</li>
          <li>No selling or sharing of any data with outside parties.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-2xl tracking-wide text-sun-300">
          What this site does
        </h2>

        <h3 className="mt-3 font-semibold text-river-50">Analytics</h3>
        <p className="text-river-200">
          We use Google Firebase Analytics to understand which pages get
          visited and roughly how many people use the site, so we can make
          it better year over year. Firebase records aggregate stats like
          page views, device type, approximate location (typically
          city-level), and a randomly generated device identifier. We don't
          attach your name, email, or any account info to that data, and we
          don't share it with advertisers. If you'd rather opt out, most
          browsers have a "Do Not Track" or content-blocking option, and
          extensions like uBlock Origin will block these requests entirely.
        </p>

        <h3 className="mt-3 font-semibold text-river-50">Push notifications (optional)</h3>
        <p className="text-river-200">
          If you tap "Enable notifications" on the Announcements page and
          grant your browser's permission prompt, we register an anonymous
          device token with Google Firebase Cloud Messaging so we can send
          you festival announcements. The token isn't tied to your name,
          email, or phone number. You can turn it off any time from the same
          button, or by revoking notification permission in your browser
          settings.
        </p>

        <h3 className="mt-3 font-semibold text-river-50">Announcements</h3>
        <p className="text-river-200">
          Announcement posts (text and timestamps) are stored in Google
          Firestore and shown publicly on the Announcements page. Only
          authorized committee members can post, edit, or delete them.
        </p>

        <h3 className="mt-3 font-semibold text-river-50">Hosting logs</h3>
        <p className="text-river-200">
          Like most websites, our hosting provider (Firebase Hosting / Google
          Cloud) keeps short-term server logs that include things like IP
          address, browser type, and which page was requested. We use these
          only for troubleshooting and don't combine them with anything
          else.
        </p>

        <h3 className="mt-3 font-semibold text-river-50">Local storage</h3>
        <p className="text-river-200">
          The site saves a couple of small values in your browser's local
          storage — for example, the timestamp of the last announcement you
          viewed, so we can highlight new ones. These values stay on your
          device and aren't sent to us.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-2xl tracking-wide text-sun-300">
          External links
        </h2>
        <p className="text-river-200">
          Some links on the site (volunteer sign-up, post-festival survey,
          etc.) point to third-party services like SignUpGenius and Google
          Forms. Those services have their own privacy policies, which apply
          once you click through.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-2xl tracking-wide text-sun-300">
          Questions
        </h2>
        <p className="text-river-200">
          Email{' '}
          <a
            href="mailto:info@rhythmoftheriver.org"
            className="text-sun-300 hover:text-sun-200"
          >
            info@rhythmoftheriver.org
          </a>{' '}
          and we'll get back to you.
        </p>
      </section>
    </div>
  );
}
