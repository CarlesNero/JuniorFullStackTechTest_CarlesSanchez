import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import type { ApiError, LoginPlayerDTO, Player } from "../interfaces/player";

import { loginPlayer } from "../services/playerApi";

import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login: loginUser } = useAuth(); // Renombramos para evitar conflicto
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loginData: LoginPlayerDTO = { username, password };

    try {
      const response: Player | ApiError = await loginPlayer(loginData);

      if ("error" in response) {
        toast.error(response.error); // Mostrar mensaje de error del backend
      } else {
        toast.success("Login successful!");
        loginUser(response); // Save payer on contexto and localStorage
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="bg-white shadow rounded-lg p-5 gap-5 flex flex-col w-[375px] mx-auto mt-10">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-xl font-bold">Login</h1>
          <p className="font-light text-gray-500">
            Introduce your user and password to start playing
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="user" className="font-medium text-sm">Username</label>
            <input
              className="border border-gray-300 rounded-md shadow p-1 px-2 outline-0"
              type="text"
              placeholder="User"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium text-sm">Password</label>
            <input
              className="border border-gray-300 rounded-md shadow p-1 px-2 outline-0"
              type="password"
              placeholder="*******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="p-2 bg-blue-500 rounded-md text-white cursor-pointer hover:bg-blue-400 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
