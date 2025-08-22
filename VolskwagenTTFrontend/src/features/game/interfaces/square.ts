export interface Square {
    id?: number,
    x: number,
    y: number,
    square_value: SquareValue
}


export interface SquareResponseDTO {
    x: number,
    y: number,
    square_value?: SquareValue
}



export interface SquareDTO {
    x: number,
    y: number
}

export type SquareValue = 'X' | 'O' | null
