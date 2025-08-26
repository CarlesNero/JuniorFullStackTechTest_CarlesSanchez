import type { createMatchResponse, Match, MatchStatusDTO, MoveRequestDTO, MoveResponsetDTO } from "../interfaces/match"


const BASE_URL = 'http://localhost:8585/api/match'

export const getAllMatches = async (): Promise<Match[]> => {
  const res = await fetch(`${BASE_URL}`)
  return res.json()
}

export const getMatch = async (matchId: number): Promise<Match> => {
  const res = await fetch(`${BASE_URL}/${matchId}`)
  return res.json()
}

export const makeMove = async (moveRequest: MoveRequestDTO): Promise<MoveResponsetDTO> => {
  const response = await fetch(`${BASE_URL}/move`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(moveRequest)
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const createMatch = async (playerId: number): Promise<createMatchResponse> => {
  const response = await fetch(`${BASE_URL}/create?playerId=${playerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return response.json();
}


export const getMatchStatus = async (matchId: number): Promise<MatchStatusDTO> => {
  const response = await fetch(`${BASE_URL}/status?matchId=${matchId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response.json();
}

export const getAllUserMatches = async(playerId: number) : Promise<MatchStatusDTO[]> => {
  const res = await fetch (`${BASE_URL}/player/${playerId}/matches`)
  return res.json()
}
