import {useState} from "react";
import {MatchContext} from "../context/matchContext";
import { Match } from "../interfaces/match";


export const MatchProvider = ({children}: {children: React.ReactNode}) => {

    const [matches, setMatches] = useState<Match[]>([]);

    return (
        <MatchContext.Provider value={{matches, setMatches}}>
            {children}
        </MatchContext.Provider>
    )



}