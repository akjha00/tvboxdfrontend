import { Link } from 'react-router-dom';

function FloatingEditButton() {
  return (
    <div className="fixed flex left-1/2 justify-center gap-4 mt-3 bottom-6">
            <Link
            to="/edit"
            className="bottom-6 bg-white hover:bg-white-200 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-md transition"
            aria-label="Edit"
            >
            ✏️
            </Link>
            <Link
            to="/"
            className="bottom-6 bg-white hover:bg-white-200 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-md transition"
            aria-label="Home">
            🏠
        </Link>
    </div>
  );
}

export default FloatingEditButton;