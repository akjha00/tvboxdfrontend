import { Link } from 'react-router-dom';

function FloatingHomeButton() {
  return (
    <div className="flex justify-center gap-4 mt-3">
      <Link
        to="/"
        className="fixed bottom-6 left-1/2 bg-white hover:bg-white-200 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-md transition duration-300 z-50"
        aria-label="Home"
      >
        🏠
      </Link>
    </div>
  );
}

export default FloatingHomeButton;