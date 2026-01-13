import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";


function Signup () {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        name: name,
        email: user.email,
        role: "member",
        teams: [],
      });

      const userId = auth.currentUser.uid;
      navigate(`/${userId}/dashboard`);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("⚠️ This email is already registered.");
      } 
      else if (err.code === "auth/invalid-email") {
        setError("🚫 Please enter a valid email address.");
      } 
      else if (err.code === "auth/weak-password") {
        setError("⚠️ Password should be at least 6 characters.");
      } 
      else {
        setError("😕 Something went wrong. Please try again.");
        console.log(err);
        
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-indigo-600 to-indigo-500 font-sans">
      <h2 className="text-white mb-2 text-2xl font-semibold">
        Sign Up
      </h2>

      {error && (
        <p className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm mb-4 flex items-center gap-2">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl w-full max-w-sm shadow-lg flex flex-col"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-3 mb-4 rounded-lg border border-gray-300 outline-none focus:border-indigo-500"
        />

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
          Sign Up
        </button>
      </form>

      <p className="text-white mt-4 text-sm">
        Already have an account?
        <span
          onClick={() => navigate("/login")}
          className="ml-1 text-indigo-200 cursor-pointer font-medium hover:underline"
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Signup;
