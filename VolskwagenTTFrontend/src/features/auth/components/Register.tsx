import { useState, type FormEvent } from "react"
import { toast } from "react-toastify"
import { ApiError, NewPlayer } from "../interfaces/player";
import { registerPlayer } from "../services/playerApi";


type Props = {
    onSwitchToLogin: () => void;
}

const Register = ({ onSwitchToLogin }: Props) => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const newPlayer: NewPlayer = { email, username, password }

        try {
            const response = await registerPlayer(newPlayer)

            // Si response tiene un error (ApiError)
            if (isApiError(response)) {
                toast.error(response.error)
            } else {
                toast.success("User registered successfully!")
                onSwitchToLogin()
                console.log("Registered user:", response)
                setEmail("")
                setUsername("")
                setPassword("")
            }
        } catch (err) {
            console.error(err)
            toast.error("An unexpected error occurred")
        } finally {
            setLoading(false)
        }

        function isApiError(obj: any): obj is ApiError {
            return obj && typeof obj === "object" && "message" in obj;
        }
    }

    return (
        <main>
            <div className="bg-white shadow rounded-lg p-5 gap-5 flex flex-col w-[375px] mx-auto">
                <div className="flex flex-col gap-2 items-center">
                    <h1 className="text-xl font-bold text-center">Register</h1>
                    <p className="font-light text-gray-500">Register and start playing</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-medium text-sm">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 rounded-md shadow p-1 px-2 outline-0"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="font-medium text-sm">Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border border-gray-300 rounded-md shadow p-1 px-2 outline-0"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-medium text-sm">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 rounded-md shadow p-1 px-2 outline-0"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </main>
    )
}

export default Register
