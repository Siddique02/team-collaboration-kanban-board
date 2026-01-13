import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-indigo-600 to-indigo-500 text-white text-center">
      <h1 className="text-4xl font-bold mb-2">
        Welcome to Team Collaboration Kanban Board
      </h1>

      <h4 className="mb-8 text-base">
        Sign up to get started or Login if you already have an account
      </h4>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="cursor-pointer px-7 py-3 text-base font-semibold bg-white text-indigo-600 rounded-lg transition-all duration-300 hover:bg-indigo-100 hover:-translate-y-1"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="cursor-pointer px-7 py-3 text-base font-semibold bg-white text-indigo-600 rounded-lg transition-all duration-300 hover:bg-indigo-100 hover:-translate-y-1"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Home;
