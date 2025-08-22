import Board from "../components/board/Board"
import Header from "../../../shared/components/Header"
import ScoreTable from "../components/ScoreTable"
import { MatchProvider } from "../provider/MatchProvider"




const HomePage = () => {
  return (
    <div className="bg-gray-300">
      <Header />
      <MatchProvider>
        <main className="max-w-5xl m-auto p-5 flex md:flex-row flex-col gap-5">
          <Board />
          <ScoreTable />
        </main>
      </MatchProvider>
    </div>
  )
}

export default HomePage