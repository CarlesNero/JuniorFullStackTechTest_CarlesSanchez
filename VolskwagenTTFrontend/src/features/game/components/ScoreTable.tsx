import { MatchStatusDTO } from "../interfaces/match";



type Props = {
  matches: MatchStatusDTO[]
}


const ScoreTable = ({ matches }: Props) => {

  let victories = matches.filter(match => match.status === 'WIN_X').length;
  let loses = matches.filter(match => match.status === 'WIN_O').length;
  let ties = matches.filter(match => match.status === 'DRAW').length;
  let unfinished = matches.filter(match => match.status === 'IN_PROGRESS').length;
  let gamesPlayed = matches.length;


  return (
    <div className="bg-white shadow rounded-lg p-4 w-full h-fit md:max-w-90">
      <h2 className="text-lg font-semibold mb-3">Stadistics</h2>
      <table className="w-full text-sm">
        <tbody>
          <tr className="border-b">
            <td className="py-2 text-gray-700">Games played:</td>
            <td className="py-2 text-right font-medium">{gamesPlayed}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 text-gray-700">Victories:</td>
            <td className="py-2 text-right font-medium text-green-600">{victories}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 text-gray-700">Ties:</td>
            <td className="py-2 text-right font-medium">{ties}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 text-gray-700">Loses:</td>
            <td className="py-2 text-right font-medium text-red-600">{loses}</td>
          </tr>
          <tr>
            <td className="py-2 text-gray-700">Unfinished:</td>
            <td className="py-2 text-right font-medium text-red-600">{unfinished}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}



export default ScoreTable