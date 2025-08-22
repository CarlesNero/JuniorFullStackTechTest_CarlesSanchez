import type { Player } from "../../auth/interfaces/player"
import type { Square, SquareDTO, SquareResponseDTO } from "./square"

export interface Match {
    id?: number,
    player: Player,
    squares: Square[],
    currentTurn: string,
    status: string
}

export interface MatchStatusDTO {
    matchId: number,
    playerTurn: string,
    status: string,
    squares: Square[]
}

export interface MoveRequestDTO {
    matchId: number,
    playerId: string,
    square: SquareDTO
}


export interface MoveResponsetDTO {
    matchId: number,
    board: SquareResponseDTO[],
    currentTurn: string,
    status: string,
    error?: string
}



export interface createMatchResponse {
    matchId: number
}


