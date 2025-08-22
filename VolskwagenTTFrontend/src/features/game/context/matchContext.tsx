// matchContext.ts
import { createContext } from "react";
import { Match } from "../interfaces/match";

interface MatchContextType {
  matches: Match[];
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
}

export const MatchContext = createContext<MatchContextType | undefined>(undefined);
