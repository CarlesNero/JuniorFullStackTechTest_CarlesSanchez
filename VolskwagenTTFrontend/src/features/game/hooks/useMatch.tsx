// hooks/useMatch.ts
import { useState, useEffect, useCallback, useContext } from "react";
import { createMatch, getMatchStatus, makeMove, getAllUserMatches } from "../services/matchApi";
import type { MatchStatusDTO, MoveRequestDTO } from "../interfaces/match";
import { MatchContext } from "../context/matchContext";

export const useMatch = (playerId: number) => {
  const [match, setMatch] = useState<MatchStatusDTO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { matches, setMatches } = useContext(MatchContext)!;

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
      const data = await getAllUserMatches(playerId);
      setMatches(data);


      if (data && data.length > 0) {
        const lastMatch = data[data.length - 1];

        const lastMatchDTO: MatchStatusDTO = {
          matchId: lastMatch.id!,
          playerTurn: lastMatch.currentTurn,
          squares: lastMatch.squares,
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
  }, [playerId]);


  const createNewMatch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await createMatch(playerId);
      const newMatch = await getMatch(data.matchId);
      setMatch(newMatch);
      const matchesData = await getAllUserMatches(playerId);
      setMatches(matchesData);
      setShowModal(false);
      return data;
    } catch (error) {
      console.error("Error creating match:", error);
      setError("Error creating new match");
    } finally {
      setIsLoading(false);
    }
  }, [playerId, getMatch]);


  const makeMoveOnClick = useCallback(async (x: number, y: number) => {
    if (!match) return;

    setIsLoading(true);
    setError(null);

    try {
      const moveRequestDTO: MoveRequestDTO = {
        matchId: match.matchId,
        playerId: "X",
        square: { x, y }
      };

      await makeMove(moveRequestDTO);
      const updatedMatch = await getMatch(match.matchId);
      setMatch(updatedMatch);


      setShowModal(updatedMatch.status !== "IN_PROGRESS");
    } catch (err) {
      console.error("Error making move:", err);
      setError("Error making move");
    } finally {
      setIsLoading(false);
    }
  }, [match, getMatch]);

  useEffect(() => {
    fetchLastMatch();
  }, [fetchLastMatch]);


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
    clearError
  };
};