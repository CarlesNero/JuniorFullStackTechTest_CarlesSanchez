import { MatchStatusDTO } from "./match";

export interface BoardProps {

    match: MatchStatusDTO | null,
    showModal: boolean,
    error: string | null,
    createNewMatch: () => void,
    makeMoveOnClick: (x:number, y:number) => Promise<void>
}

export interface ErrorProps extends Pick<BoardProps, 'error' | 'createNewMatch'>{}
export interface NoMatchProps extends Pick<BoardProps, 'createNewMatch'>{}
export interface MatchProps extends Omit<BoardProps, 'matches' | 'isLoading' >{}
