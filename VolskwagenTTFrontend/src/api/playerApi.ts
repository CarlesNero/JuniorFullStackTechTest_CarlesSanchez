import type { ApiError, LoginPlayerDTO, Player } from "../interfaces/player"

const BASE_URL = 'http://localhost:8585/api/player'

/* Register a new player */

export const registerPlayer = async (player: Player): Promise<Player | ApiError> => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  });

  if (!res.ok) {
    const errorData: ApiError = await res.json();
    return errorData;
  }

  return res.json();
};


/*   Login a player */

export const loginPlayer = async (loginData: LoginPlayerDTO): Promise<Player | ApiError> => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!res.ok) {
    const errorData: ApiError = await res.json();
    return errorData;
  }

  return res.json();
};


/* Get a player by id */

export const getPlayer = async (playerId: number): Promise<Player> => {
    const res = await fetch(`${BASE_URL}/player/${playerId}`)
    return res.json()
}

/* Get all players */

export const getAllPlayers = async() : Promise<Player[]> =>{
    const res = await fetch(`${BASE_URL}/player`)
    return res.json()
}