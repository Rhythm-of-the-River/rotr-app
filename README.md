# Rhythm of the River

Static web app for the Rhythm of the River music festival. Built with
**Vite + React + TypeScript + Tailwind CSS** and powered entirely by **Firebase**
(Hosting, Firestore, Auth, Cloud Messaging).

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** for all styling
- **React Router** for client-side routing
- **Firebase Hosting** for static delivery
- **Firestore** for real-time announcements + committee membership
- **Firebase Auth** (email/password) for committee posting
- **Firebase Cloud Messaging** for browser push notifications
- **Cloud Build** for CI/CD deploys

No application backend is required.

## Getting started

```bash
npm install
npm run dev
```

Visit http://localhost:5173.

### Dev time simulator

While running `npm run dev`, a floating widget appears in the bottom-right
corner that lets you jump the app's clock to specific festival moments
(pre-festival, gates open, headline sets, etc.) or any custom date/time. The
widget never renders in production builds (`import.meta.env.DEV` gate).

## Project structure

```
src/
  components/   # Reusable UI: Layout, Navbar, BandCard, Modal, ...
  context/      # TimeProvider (clock + dev simulator)
  data/         # Static JSON: schedule, activities, food, bar, art
  hooks/        # useAnnouncements, useAuth, useCommitteeMember
  pages/        # SchedulePage, AnnouncementsPage, FloydPage, ...
  types/        # Shared TS types
  utils/        # time parsing, schedule decoration, notifications
  config.ts     # Festival dates + nav links
  firebase.ts   # Firebase SDK initialization
  router.tsx    # React Router config
  main.tsx      # App entry
public/
  firebase-messaging-sw.js   # FCM background service worker
```

## Festival data

Edit `src/data/schedule.json` (lineup), `src/data/activities.json`,
`src/data/food.json`, `src/data/bar.json`, and `src/data/art.json`. To roll the
app forward to a new year, update `FESTIVAL.fridayDate` / `saturdayDate` in
`src/config.ts`.

## Committee posting (`/floyd`)

1. Add the committee member to **Firebase Authentication** (email/password).
2. Create a Firestore doc at `committee_members/{uid}` (any payload works — the
   app only checks for the doc's existence).
3. They can now sign in at `/floyd` and post announcements to the
   `announcements` collection.

Firestore security rules in `firestore.rules` enforce that only authenticated
committee members can write announcements.

## Push notifications

The app uses Firebase Cloud Messaging with topic-based fan-out:

1. Users opt-in via the **Enable notifications** button on `/announcements`.
   The client calls the `manageAnnouncementSubscription` callable, which
   subscribes their FCM token to the `announcements` topic.
2. The `onNewAnnouncement` Firestore trigger (in `functions/`) fans out every
   newly created announcement to that topic. No token list to maintain.

The public Web Push VAPID key is hardcoded in [src/firebase.ts](src/firebase.ts);
rotate it via Firebase Console → Project Settings → Cloud Messaging.

Functions code lives in [functions/src/index.ts](functions/src/index.ts).

```bash
cd functions && npm install && npm run build && cd ..
npx firebase deploy --only functions
```

> Cloud Functions require the **Blaze** (pay-as-you-go) plan and the
> Cloud Functions / Cloud Build / Artifact Registry APIs enabled on the project.

## Deploy

CI deploys via `cloudbuild.yaml`:

1. `npm ci && npm run build` (Node 20) for the static site
2. `cd functions && npm ci && npm run build` for Cloud Functions
3. `firebase deploy --only hosting,firestore,functions`

To deploy locally:

```bash
npm run build
cd functions && npm run build && cd ..
npx firebase deploy --only hosting,firestore,functions
```
