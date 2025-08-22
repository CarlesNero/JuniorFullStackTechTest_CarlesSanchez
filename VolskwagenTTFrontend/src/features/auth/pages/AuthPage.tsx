import { useState } from "react"
import Login from "../components/Login"
import Register from "../components/Register"


const AuthPage = () => {
  const [activeRoute, setActiveRoute] = useState<"login" | "register">("login")

  return (
    <main className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-indigo-100 to-slate-50 gap-4">
      
      
      <div className="flex gap-2 items-center bg-white p-1 rounded w-96 shadow-md">
        <button
          className={`w-1/2 p-3 font-bold rounded transition-color cursor-pointer ${
            activeRoute === "login" ? "bg-indigo-500 text-white inset-shadow-sm" : "bg-white text-gray-700 "
          }`}
          onClick={() => setActiveRoute("login")}
        >
          Login
        </button>
        <button
          className={`w-1/2 p-3 font-bold rounded transition-colors cursor-pointer ${
            activeRoute === "register" ? "bg-indigo-500 text-white inset-shadow-sm" : "bg-white text-gray-700"
          }`}
          onClick={() => setActiveRoute("register")}
        >
          Register
        </button>
      </div>

      {/* Render the active component */}
      {activeRoute === "login" ? <Login /> : <Register onSwitchToLogin={() => setActiveRoute("login")} />}
    </main>
  )
}

export default AuthPage
