import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const userId = auth.currentUser.uid
      navigate(`/${userId}/dashboard`);
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("⚠️Invalid email or password");
      } else if (err.code === "auth/user-not-found") {
        setError("🚫No account found with this email");
      } else if (err.code === "auth/wrong-password") {
        setError("❌Incorrect password");
      } else {
        setError("😕Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-indigo-600 to-indigo-500 font-sans">
      <h2 className="text-white mb-2 text-2xl font-semibold">
        Login
      </h2>

      {error && (
        <p className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm mb-4 flex items-center gap-2">
          {error}
        </p>
      )}

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl w-full max-w-sm shadow-lg flex flex-col"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 mb-4 rounded-lg border border-gray-300 text-sm outline-none focus:border-indigo-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 mb-4 rounded-lg border border-gray-300 text-sm outline-none focus:border-indigo-500"
        />

        <button
          type="submit"
          className="p-3 bg-indigo-600 text-white rounded-lg text-base font-medium cursor-pointer transition-all duration-300 hover:bg-indigo-700 active:scale-95"
        >
          Login
        </button>
      </form>

      <p className="text-white mt-4 text-sm">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-indigo-200 cursor-pointer font-medium hover:underline"
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default Login;
