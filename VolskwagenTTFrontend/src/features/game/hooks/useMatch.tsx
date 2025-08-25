// hooks/useMatch.ts
import { useState, useEffect, useCallback } from "react";
import { createMatch, getMatchStatus, makeMove, getAllUserMatches } from "../services/matchApi";
import type { Match, MatchStatusDTO, MoveRequestDTO } from "../interfaces/match";


export const useMatch = (playerId: number) => {
  const [match, setMatch] = useState<MatchStatusDTO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchStatusDTO[]>([]);

  const getMatch = useCallback(async (matchId: number) => {
    try {
      const data = await getMatchStatus(matchId);
      return data;
    } catch (err) {
      console.error("Error getting match:", err);
      throw err;
    }
  }, []);



  const fetchLastMatch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllUserMatches(playerId)
      setMatches(data)

      if (data && data.length > 0) {
        const lastMatch = data[data.length - 1];

        const lastMatchDTO: MatchStatusDTO = {
          id: lastMatch.id!,
          currentTurn: lastMatch.currentTurn,
          board: lastMatch.board,
          status: lastMatch.status,
        };

        setMatch(lastMatchDTO);
      } else {
        setMatch(null);
      }

    } catch (error) {
      console.error("Error fetching matches:", error);
      setError("Error loading matches");
    } finally {
      setIsLoading(false);
    }
  }, [match]);


  const createNewMatch =  async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await createMatch(playerId);
      const newMatch = await getMatch(data.matchId);
      setMatch(newMatch);
      setShowModal(false);
      setMatches([...matches, newMatch!])
      return data;
    } catch (error) {
      console.error("Error creating match:", error);
      setError("Error creating new match");
    } finally {
      setIsLoading(false);
    }
  };


  const makeMoveOnClick = useCallback(async (x: number, y: number) => {
    if (!match) return;

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [match, getMatch]);

  const endGame = (updatedMatch: MatchStatusDTO) => {
    setShowModal(true)
    setMatches(matches.map(_match => _match?.id === updatedMatch.id ? updatedMatch : _match))
  }

  useEffect(() => {
    fetchLastMatch();
  }, []);


  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    match,
    showModal,
    isLoading,
    error,
    createNewMatch,
    makeMoveOnClick,
    fetchLastMatch,
    closeModal,
    clearError,
    matches
  };
};