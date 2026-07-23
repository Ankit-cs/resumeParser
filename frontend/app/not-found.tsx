import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-400 mb-6">The page you are looking for does not exist.</p>
      <Link href="/" className="primary-button">
        Go Back Home
      </Link>
    </div>
  );
}
