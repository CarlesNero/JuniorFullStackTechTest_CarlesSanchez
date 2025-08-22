// components/board/Board.tsx
import { useAuth } from "../../../auth/context/AuthContext";
import { useMatch } from "../../hooks/useMatch";
import ModalEndGame from "../modalEndGame";
import Square from "./square/Square";
import NewMatchBtn from "./newMatchBtn/NewMatchBtn";

const Board = () => {
  const { player } = useAuth();
  
  const {
    match,
    showModal,
    isLoading,
    error,
    createNewMatch,
    makeMoveOnClick
  } = useMatch(player.id);


  if (isLoading && !match) {
    return (
      <div className="bg-white rounded-md p-5 flex flex-col items-center gap-5 max-w-xl m-auto min-h-96 md:w-xl justify-center absolute top-1/2 left-1/2 -translate-1/2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p>Loading...</p>
      </div>
    );
  }


  if (error && !match) {
    return (
      <div className="bg-white rounded-md p-5 flex flex-col items-center gap-5 max-w-xl m-auto min-h-96 md:w-xl justify-center absolute top-1/2 left-1/2 -translate-1/2">
        <div className="text-red-500">
          <p>❌ {error}</p>
        </div>
        <NewMatchBtn onButtonClick={createNewMatch} />
      </div>
    );
  }


  if (!match) {
    return (
      <div className="bg-white rounded-md p-5 flex flex-col items-center gap-5 max-w-xl m-auto min-h-96 md:w-xl justify-center absolute top-1/2 left-1/2 -translate-1/2">
        <h1>You haven't started any game yet</h1>
        <NewMatchBtn onButtonClick={createNewMatch} />
      </div>
    );
  }


  return (
    <div className="bg-white rounded-md p-5 flex flex-col items-center gap-5 max-w-xl lg:w-xl m-auto">
     
      {showModal && (
        <ModalEndGame status={match.status}>
          <NewMatchBtn onButtonClick={createNewMatch} />
        </ModalEndGame>
      )}

 
      <h1 className="font-medium text-xl">
        It's your turn player <span className="font-black">{match.playerTurn}</span>
      </h1>


      <div className="grid grid-cols-3 w-full gap-3 p-5 rounded-md shadow-md">
        {match.squares.map(square => (
          <Square
            key={square.id || `${square.x}-${square.y}`}
            square={square}
            onSquareClick={makeMoveOnClick}
          />
        ))}
      </div>


      <NewMatchBtn onButtonClick={createNewMatch} />


      {isLoading && (
        <div className="text-blue-500 text-sm">
          Creating new match...
        </div>
      )}


      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default Board;