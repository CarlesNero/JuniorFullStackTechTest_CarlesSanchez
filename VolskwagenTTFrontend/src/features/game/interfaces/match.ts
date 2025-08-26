import type { Player } from "../../auth/interfaces/player"
import type { Square, SquareDTO, SquareResponseDTO } from "./square"

export interface Match {
    id?: number,
    player: Player,
    board: Square[],
    currentTurn: string,
    status: string
}

export interface MatchStatusDTO {
    id: number,
    currentTurn: string,
    status: string,
    board: Square[]
}

export interface MoveRequestDTO {
    matchId: number,
    playerId: string,
    square: SquareDTO
}


export interface MoveResponsetDTO {
    id: number,
    board: SquareResponseDTO[],
    currentTurn: string,
    status: string,
    error?: string
}



export interface createMatchResponse {
    matchId: number
}


