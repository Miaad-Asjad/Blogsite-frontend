
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center gap-4 px-4">
        <p className="text-xl font-semibold text-red-600">
        ✍️ To write a blog, you need to create an account first.
        </p>
        <p className="text-gray-700">If you already have an account, please log in.
        If not, please register first.</p>
        <div className="flex gap-4">
          <Link
            to="/register"
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 