import { useState, type FormEvent } from 'react';
import {
  LogIn,
  LogOut,
  Megaphone,
  Lock,
  Pencil,
  Trash2,
  Save,
  X
} from 'lucide-react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useCommitteeMember } from '@/hooks/useCommitteeMember';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { formatClock } from '@/utils/time';
import type { Announcement } from '@/types';

export default function FloydPage() {
  const { user, loading: authLoading, signIn, logOut } = useAuth();
  const { isMember, name, loading: memberLoading } = useCommitteeMember(user?.uid);

  if (authLoading) return <div className="text-river-300">Loading…</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header className="space-y-1">
        <h1 className="font-display text-4xl tracking-wider text-river-50 sm:text-5xl">
          Floyd's Happy Place
        </h1>
        <p className="text-sm text-river-300">
          Committee-only space for posting announcements to the festival app.
        </p>
      </header>

      {!user && <SignInForm onSignIn={signIn} />}

      {user && memberLoading && <div className="text-river-300">Verifying…</div>}

      {user && !memberLoading && !isMember && (
        <div className="card space-y-3 p-5">
          <div className="flex items-center gap-2 text-sun-300">
            <Lock size={18} /> Not authorized
          </div>
          <p className="text-sm text-river-200">
            You're signed in as <strong>{user.email}</strong>, but this account
            isn't on the committee list. Reach out to a festival organizer to be
            added.
          </p>
          <button type="button" onClick={logOut} className="btn-secondary w-full">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      )}

      {user && isMember && (
        <>
          <PostForm email={user.email ?? ''} name={name} onLogOut={logOut} />
          <ManageAnnouncements />
        </>
      )}
    </div>
  );
}

function SignInForm({
  onSignIn
}: {
  onSignIn: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await onSignIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-3 p-5">
      <h2 className="text-2xl text-sun-200">Sign in</h2>
      <label className="block text-sm text-river-200">
        Email
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mt-1"
        />
      </label>
      <label className="block text-sm text-river-200">
        Password
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input mt-1"
        />
      </label>
      {error && <p className="text-sm text-sun-300">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary w-full">
        <LogIn size={16} /> {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

function PostForm({
  email,
  name,
  onLogOut
}: {
  email: string;
  name: string | null;
  onLogOut: () => void;
}) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setBusy(true);
    setFeedback(null);
    try {
      const now = Math.floor(Date.now() / 1000);
      await addDoc(collection(db, 'announcements'), {
        time: now,
        subject: subject.trim(),
        message: message.trim(),
        user: email,
        name: name ?? '',
        createdAt: serverTimestamp()
      });
      setSubject('');
      setMessage('');
      setFeedback({ type: 'ok', text: 'The masses have been notified!' });
    } catch (err) {
      setFeedback({
        type: 'err',
        text: err instanceof Error ? err.message : 'Failed to post'
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-3 p-5">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Megaphone className="text-sun-300" size={20} />
          <h2 className="text-2xl text-sun-200">Make an announcement</h2>
        </div>
        <button
          type="button"
          onClick={onLogOut}
          className="btn-ghost text-sm"
          title={email}
        >
          <LogOut size={14} /> Sign out
        </button>
      </header>
      <label className="block text-sm text-river-200">
        Subject
        <input
          required
          maxLength={120}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input mt-1"
          placeholder="The deets."
        />
      </label>
      <label className="block text-sm text-river-200">
        Message
        <textarea
          required
          rows={8}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input mt-1 resize-y"
          placeholder="Spread the good gospel of Floyd here"
        />
      </label>
      {feedback && (
        <p
          className={
            feedback.type === 'ok' ? 'text-sm text-river-200' : 'text-sm text-sun-300'
          }
        >
          {feedback.text}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn-primary w-full">
        {busy ? 'Posting…' : 'Submit'}
      </button>
    </form>
  );
}

function ManageAnnouncements() {
  const { announcements, loading, error } = useAnnouncements();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <section className="card space-y-3 p-5">
      <h2 className="text-2xl text-sun-200">Existing announcements</h2>
      {loading && <p className="text-sm text-river-300">Loading…</p>}
      {error && <p className="text-sm text-sun-300">{error}</p>}
      {!loading && !announcements.length && (
        <p className="text-sm text-river-300">Nothing posted yet.</p>
      )}
      <ul className="space-y-3">
        {announcements.map((a) => (
          <li key={a.id}>
            {editingId === a.id ? (
              <EditRow
                announcement={a}
                onDone={() => setEditingId(null)}
              />
            ) : (
              <ViewRow
                announcement={a}
                onEdit={() => setEditingId(a.id)}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ViewRow({
  announcement,
  onEdit
}: {
  announcement: Announcement;
  onEdit: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    if (!window.confirm(`Delete "${announcement.subject}"? This can't be undone.`)) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'announcements', announcement.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      setBusy(false);
    }
  };

  return (
    <article className="rounded-lg border border-river-700/60 bg-river-900/40 p-3">
      <header className="mb-1 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-river-50">
            {announcement.subject}
          </h3>
          <p className="text-xs text-river-400">
            {formatClock(announcement.time)} · {announcement.name || announcement.user}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onEdit}
            disabled={busy}
            className="btn-ghost text-sm"
            title="Edit"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="btn-ghost text-sm text-sun-300 hover:text-sun-200"
            title="Delete"
          >
            <Trash2 size={14} /> {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </header>
      <p className="whitespace-pre-wrap text-sm text-river-100">
        {announcement.message}
      </p>
      {error && <p className="mt-1 text-xs text-sun-300">{error}</p>}
    </article>
  );
}

function EditRow({
  announcement,
  onDone
}: {
  announcement: Announcement;
  onDone: () => void;
}) {
  const [subject, setSubject] = useState(announcement.subject);
  const [message, setMessage] = useState(announcement.message);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await updateDoc(doc(db, 'announcements', announcement.id), {
        subject: subject.trim(),
        message: message.trim(),
        editedAt: serverTimestamp()
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={save}
      className="space-y-2 rounded-lg border border-sun-400/40 bg-river-900/40 p-3"
    >
      <input
        required
        maxLength={120}
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="input"
      />
      <textarea
        required
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="input resize-y"
      />
      {error && <p className="text-xs text-sun-300">{error}</p>}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          disabled={busy}
          className="btn-ghost text-sm"
        >
          <X size={14} /> Cancel
        </button>
        <button type="submit" disabled={busy} className="btn-primary text-sm">
          <Save size={14} /> {busy ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
