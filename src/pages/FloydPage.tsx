import { useState, type FormEvent } from 'react';
import { LogIn, LogOut, Megaphone, Lock } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useCommitteeMember } from '@/hooks/useCommitteeMember';

export default function FloydPage() {
  const { user, loading: authLoading, signIn, logOut } = useAuth();
  const { isMember, loading: memberLoading } = useCommitteeMember(user?.uid);

  if (authLoading) return <div className="text-river-300">Loading…</div>;

  return (
    <div className="mx-auto max-w-md space-y-4">
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
            You're signed in as <strong>{user.email}</strong>, but this account isn't on
            the committee list. Reach out to a festival organizer to be added.
          </p>
          <button type="button" onClick={logOut} className="btn-secondary w-full">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      )}

      {user && isMember && (
        <PostForm
          email={user.email ?? ''}
          onLogOut={logOut}
        />
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

function PostForm({ email, onLogOut }: { email: string; onLogOut: () => void }) {
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
