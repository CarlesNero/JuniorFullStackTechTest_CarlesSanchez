type Props = {
    status: string,
    children: React.ReactNode
}

const getEndGameMessage = (status: string) => {
    switch (status) {
        case "WIN_X": return "¡You win!😁";
        case "WIN_O": return "¡You lose! 😭";
        case "DRAW": return "¡You have tied! 🤔";
        default: return "";
    }
}

const getEndGameColor = (status: string) => {
    switch (status) {
        case "WIN_X": return "text-green-500";
        case "WIN_O": return "text-red-500";
        case "DRAFT": return "text-gray-500";
        default: return "";
    }
}


const modalEndGame = (props: Props) => {
    return (
        <div className="absolute top-1/2 lef-1/2 -transition-1/2 bg-white p-5 flex flex-col gap-5 shadow w-1/2 max-w-md rounded-lg">
            <h1 className={`text-3xl text-center font-bold ${getEndGameColor(props.status)}`}>
                {getEndGameMessage(props.status)}
            </h1>
            {props.children}
        </div>
    )
}

export default modalEndGame