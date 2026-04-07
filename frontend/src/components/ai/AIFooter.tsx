import { Link } from 'react-router-dom';

export default function AIFooter() {
  return (
    <footer className="border-t border-gray-200 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold mb-4">VortixPR</h3>
            <p className="text-sm text-gray-600">
              The PR agency for AI startups.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/services" className="hover:text-black">All Services</Link></li>
              <li><Link to="/pricing" className="hover:text-black">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-black">About</Link></li>
              <li><Link to="/clients" className="hover:text-black">Clients</Link></li>
              <li><Link to="/contact" className="hover:text-black">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Other Brands</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/crypto" className="hover:text-black">Vortix Crypto →</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} VortixPR. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link to="/privacy-policy" className="hover:text-black">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-black">Terms</Link>
            <Link to="/cookie-policy" className="hover:text-black">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
