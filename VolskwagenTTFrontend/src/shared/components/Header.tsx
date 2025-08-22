import { useAuth } from "../../features/auth/context/AuthContext";

const Header = () => {
    const { player } = useAuth();
    const { logout } = useAuth();

    return (

        <nav className="p-5  flex justify-between items-center max-w-5xl m-auto">
            <div className="flex-col gap-2">

                <div className="flex gap-4 items-center">
                    <img className="w-10 aspect-square " src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/2048px-Volkswagen_logo_2019.svg.png" alt="" />
                    <h1 className="text-4xl font-black">Tic Tac Toe </h1>
                </div>
                <p className="flex gap-1 font-medium text-blue-900">
                    Hello
                    <span>
                        {player?.username ?? "Invitado"} !
                    </span>
                </p>
            </div>
            <button className="p-1 shadow px-2 rounded bg-white font-medium h-fit hover:inset-shadow-sm transition cursor-pointer" onClick={logout}>Logout</button>
        </nav>
    );
};

export default Header;
