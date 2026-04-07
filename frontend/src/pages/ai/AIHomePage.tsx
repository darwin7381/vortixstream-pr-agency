import { Link } from 'react-router-dom';

export default function AIHomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          VortixPR
        </h1>
        <p className="text-lg text-gray-600">
          The AI PR agency, built for AI startups and solo founders.
          <br />
          Coming soon.
        </p>
        <Link
          to="/crypto"
          className="inline-block px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition"
        >
          Looking for crypto PR? Visit Vortix Crypto →
        </Link>
      </div>
    </div>
  );
}
