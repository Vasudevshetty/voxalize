import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-8 bg-[#131313] p-8 rounded-xl border border-gray-800 text-center">
        <div>
          <h1 className="text-8xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
              404
            </span>
          </h1>
          <h2 className="text-3xl text-white mb-6">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-green-400 to-cyan-400 text-black font-semibold rounded-lg px-6 py-3 hover:opacity-90 transition-opacity"
          >
            Return Home
          </Link>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
