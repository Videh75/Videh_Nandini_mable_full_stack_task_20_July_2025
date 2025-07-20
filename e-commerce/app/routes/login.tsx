import { useState } from "react";
import { useNavigate, Link } from "@remix-run/react";
import api from "~/api/axios";
import { useUserStore } from "~/store/user";
import { trackEvent } from "~/utils/trackEvent";

export default function Login() {
  const [error, setError] = useState("");
  const setEmail = useUserStore((state) => state.setEmail);
  const setSessionId = useUserStore((state) => state.setSessionId);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    try {
      await api.post("/login", { email, password });

      const sessionId = "session_" + email;

      await trackEvent({
        event_type: "lead_login",
        user_email: email,
        session_data: sessionId,
        source_page: "Login Page",
      });

      setEmail(email);
      setSessionId(sessionId);
      navigate("/product-library");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Do not have an account?{" "}
          <Link to="/signup" className="text-green-600 hover:underline">
            Create
          </Link>
        </p>
      </div>
    </div>
  );
}
