import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-[120px] animate-bounce">😵</div>
      <h1 className="text-7xl font-extrabold text-gray-800 mb-4 tracking-tight">
        404
      </h1>
      <p className="text-xl text-gray-600 mb-6 text-center">
        Sorry, we couldn't find that page.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}
