export interface Square {
    id?: number,
    x: number,
    y: number,
    square_value: SquareValue | null
}


export interface SquareResponseDTO {
    x: number,
    y: number,
    square_value?: SquareValue | null
}



export interface SquareDTO {
    x: number,
    y: number
}

export enum SquareValue {
    X = 'X',
    O = 'O'
}
