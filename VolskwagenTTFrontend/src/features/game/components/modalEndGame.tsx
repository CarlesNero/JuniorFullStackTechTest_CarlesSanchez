type Props = {
    status: string,
    children: React.ReactNode
}

const getEndGameMessage = (status: string) => {
    switch (status) {
        case "WIN_X": return "¡You win!";
        case "WIN_O": return "¡You lose!";
        case "DRAW": return "Its a tie!";
        default: return "";
    }
}

const getEndGameColor = (status: string) => {
    switch (status) {
        case "WIN_X": return "oklch(82.8% 0.189 84.429)";
        case "WIN_O": return "#fb2c36";
        case "DRAW": return "#6a7282";
        default: return "";
    }
}

const getEndGameIcon = (status: string) => {
    switch (status) {
        case "WIN_X": return "🏆";
        case "WIN_O": return "😢";
        case "DRAW": return "🤝";
        default: return "";
    }
}


const modalEndGame = (props: Props) => {
    const color = getEndGameColor(props.status)
    return (
        <div style={{ borderColor: color }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2 bg-white p-5 flex flex-col gap-5 shadow w-1/2 max-w-md rounded-lg border-2 border-${color}`}>
            <h1 className="text-center text-5xl" >{getEndGameIcon(props.status)} </h1>
            <h1 className={`text-3xl text-center font-bold ` } style={{ color : color }}>
                {getEndGameMessage(props.status)}
            </h1>
            {props.children}
        </div>
    )
}

export default modalEndGame