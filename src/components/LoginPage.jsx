import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.jpg";

// Replace the placeholder loginUser function with actual backend call
async function loginUser(email, password) {
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
}

function LoginPage({ onLogin, backend }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const result = await loginUser(email, password);
      
      if (!result.user || !result.user.email) {
        throw new Error('Invalid response from server');
      }

      // Pass the complete user object
      onLogin(result.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setPassword("");
    }
  }

  return (
    <>
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
        >
          <h2 className="text-2xl font-extrabold mb-6 text-center text-indigo-700 tracking-wide">
            Welcome To NamiBoard
          </h2>
          {error && (
            <div className="mb-4 text-red-600 text-center font-semibold">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 font-semibold mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg w-full transition mb-3"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <span
              className="text-indigo-600 cursor-pointer underline hover:text-indigo-800 font-semibold"
              onClick={() => navigate("/SignUp")}
            >
              Sign up
            </span>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginPage;