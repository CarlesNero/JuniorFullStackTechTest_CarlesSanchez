import Board from "../components/board/Board"
import Header from "../../../shared/components/Header"
import ScoreTable from "../components/ScoreTable"
import { useAuth } from "../../auth/context/AuthContext";
import { useMatch } from "../hooks/useMatch";





const HomePage = () => {
  const { player } = useAuth();

  const {
    match,
    matches,
    showModal,
    isLoading,
    error,
    createNewMatch,
    makeMoveOnClick
  } = useMatch(player.id);


  return (
    <div className="bg-gray-300">
      <Header />
      <main className="max-w-5xl m-auto p-5 flex md:flex-row flex-col gap-5">
        <Board match={match!} matches={matches} showModal={showModal} isLoading={isLoading} error={error} createNewMatch={createNewMatch} makeMoveOnClick={makeMoveOnClick} />
        <ScoreTable matches={matches}/>
      </main>
    </div>
  )
}


export default HomePage