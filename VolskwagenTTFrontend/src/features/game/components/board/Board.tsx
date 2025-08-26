import ModalEndGame from "../modalEndGame";
import Square from "./square/Square";
import NewMatchBtn from "./newMatchBtn/NewMatchBtn";
import { BoardProps, ErrorProps, MatchProps, NoMatchProps } from "../../interfaces/boardProps";


const Error = ({ error, createNewMatch }: ErrorProps) => (
  <div className="bg-white rounded-md p-5 flex flex-col items-center gap-5 max-w-xl m-auto min-h-96 w-full md:w-xl justify-center">
    <div className="text-red-500">
      <p>{error}</p>
    </div>
    <NewMatchBtn onButtonClick={createNewMatch} />
  </div>
)
const NoMatch = ({ createNewMatch }: NoMatchProps) => (
  <div className="bg-white rounded-md p-5 flex flex-col items-center w-full gap-5 m-auto min-h-96  justify-center ">
    <h1>You haven't started any game yet</h1>
    <NewMatchBtn onButtonClick={createNewMatch} />
  </div>
)

const Match = ({ showModal, createNewMatch, makeMoveOnClick, match, error }: MatchProps) => {
  return (
    <div className="bg-white rounded-md p-5 flex flex-col items-center gap-5 w-full m-auto">

      {showModal && (
        <ModalEndGame status={match!.status}>
          <NewMatchBtn onButtonClick={createNewMatch} />
        </ModalEndGame>
      )}


      <h1 className="font-medium text-xl">
        It's your turn player <span className="font-black">{match!.currentTurn}</span>
      </h1>


      <div className="grid grid-cols-3 w-full gap-3 p-5 rounded-md shadow-md">
        {match!.board.map(square => (
          <Square
            key={square.id || `${square.x}-${square.y}`}
            square={square}
            onSquareClick={makeMoveOnClick}
          />
        ))}
      </div>


      <NewMatchBtn onButtonClick={createNewMatch} />

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}



const Board = ({ match, showModal, error, createNewMatch, makeMoveOnClick }: BoardProps) => {
  let html;
  if (error) {
    html = <Error createNewMatch={createNewMatch} error={error} />
  } else if (!match) {
    html = <NoMatch createNewMatch={createNewMatch} />
  } else {
    html = <Match showModal={showModal} createNewMatch={createNewMatch} makeMoveOnClick={makeMoveOnClick} match={match} error={error} />
  }
  return html;
}

export default Board;