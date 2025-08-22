import Board from "../components/board/Board"
import Header from "../components/Header"



const HomePage = () => {
  return (
    <div className="bg-gray-300 h-dvh">
      <Header/>
      <main className="max-w-5xl m-auto p-5">
        <Board/>
      </main>
    </div>
  )
}

export default HomePage