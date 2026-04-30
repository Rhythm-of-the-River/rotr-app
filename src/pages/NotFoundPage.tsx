import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="card mx-auto max-w-md p-8 text-center">
      <h1 className="font-display text-5xl text-sun-300">404</h1>
      <p className="mt-2 text-river-200">That page floated downstream.</p>
      <Link to="/" className="btn-primary mt-4 inline-flex">
        Back to schedule
      </Link>
    </div>
  );
}
