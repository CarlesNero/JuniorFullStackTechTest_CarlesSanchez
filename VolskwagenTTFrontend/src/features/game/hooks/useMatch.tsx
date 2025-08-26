// hooks/useMatch.ts
import { useState, useEffect } from "react";
import { getMatchStatus, getAllUserMatches, makeMove, createMatch } from "../services/matchApi";
import type { MatchStatusDTO, MoveRequestDTO } from "../interfaces/match";


export const useMatch = (playerId: number) => {
  const [match, setMatch] = useState<MatchStatusDTO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchStatusDTO[]>([]);


  /* Use Effects */


  const fetchLastMatch = async () => {

    setError(null);

    try {
      const data = await getAllUserMatches(playerId)
      setMatches(data)

      if (data && data.length > 0) {
        const lastMatch = data[data.length - 1];

        setMatch(lastMatch);
      } else {
        setMatch(null);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      setError("Error loading matches");
    }
  }


  useEffect(() => {
    fetchLastMatch();
  }, [match]);


  /* Functions */

  const getMatch = async (matchId: number) => {
    try {
      const data = await getMatchStatus(matchId);
      return data;
    } catch (err) {
      console.error("Error getting match:", err);
      throw err;
    }
  };

  const createNewMatch = async () => {

    setError(null);

    try {
      const data = await createMatch(playerId);
      const newMatch = await getMatchStatus(data.matchId);
      setMatch(newMatch);
      setShowModal(false);
      setMatches([...matches, newMatch!])
      return data;
    } catch (error) {
      console.error("Error creating match:", error);
      setError("Error creating new match");

    }
  };


  const makeMoveOnClick = async (x: number, y: number) => {
    if (!match) return;

    setError(null);

    try {
      const moveRequestDTO: MoveRequestDTO = {
        matchId: match.id,
        playerId: "X",
        square: { x, y }
      };

      await makeMove(moveRequestDTO);
      const updatedMatch = await getMatch(match.id);
      setMatch(updatedMatch);

      if (updatedMatch.status !== "IN_PROGRESS") endGame(updatedMatch)

    } catch (err) {
      console.error("Error making move:", err);
      setError("Error making move");
    }
  };

  const endGame = (updatedMatch: MatchStatusDTO) => {
    setShowModal(true)
    setMatches(matches.map(_match => _match?.id === updatedMatch.id ? updatedMatch : _match))
  }

  const closeModal = () => setShowModal(false);

  const clearError = () => setError(null);



  return {
    match,
    showModal,
    error,
    fetchLastMatch,
    closeModal,
    clearError,
    matches,
    makeMoveOnClick,
    createNewMatch
  };
};