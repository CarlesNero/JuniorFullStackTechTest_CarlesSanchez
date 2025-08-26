import { describe, expect, vi } from 'vitest'

import '@testing-library/jest-dom'


import { render, waitFor } from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import { Square, SquareValue } from '../interfaces/square'
import { createMatchResponse, MatchStatusDTO } from '../interfaces/match'
import HomePage from './HomePage'
import * as matchApi from "../services/matchApi";



const mockSquares: Square[] = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    x: index % 3,
    y: Math.floor(index / 3),
    square_value: null
}))

const mockMatch: MatchStatusDTO = {
    id: 1,
    currentTurn: 'X',
    board: mockSquares,
    status: 'IN_PROGRESS'
}

const newMatchResponse: createMatchResponse = {
    matchId: 1
}


vi.mock('../../auth/context/AuthContext', () => ({
    useAuth: vi.fn(() => ({ player: { id: 1, username: 'admin', email: 'admin@gmail.com' } })),
}));

vi.spyOn(matchApi, "createMatch").mockResolvedValue(newMatchResponse);
vi.spyOn(matchApi, "getMatchStatus").mockResolvedValue(mockMatch);



describe('homePageTest', () => {

    afterEach(() => {
        vi.resetAllMocks()
    })


    test('create new game', async () => {

        const matches: MatchStatusDTO[] = [];
        vi.spyOn(matchApi, "getAllUserMatches").mockResolvedValue(matches);

        const { getByText } = render(
            <HomePage />
        )

        const titleElement = await waitFor(() => getByText("You haven't started any game yet"))

        expect(titleElement).toBeInTheDocument();

        const newGameButton = await waitFor(() => getByText('Create new game'))

        userEvent.click(newGameButton)
        await waitFor(async () => {
            const playerText = await waitFor(() => getByText("It's your turn player"))
            expect(playerText).toBeInTheDocument();
        })

    })


    test('recover in progress match', async () => {

        const customBoard = mockMatch.board.map((square, index) => index === 0 ? { ...square, square_value: SquareValue.X } : square)

        const matchInProgress = {
            ...mockMatch,
            board: customBoard
        }

        const matches: MatchStatusDTO[] = [matchInProgress];
        vi.spyOn(matchApi, "getAllUserMatches").mockResolvedValue(matches);

        const { getByText, getByTestId } = render(
            <HomePage />
        )

        const titleElement = await waitFor(() => getByText("It's your turn player"))

        const squareOne = await waitFor(() => getByTestId('square-1'))

        expect(titleElement).toBeInTheDocument();

        expect(squareOne).toHaveTextContent(SquareValue.X)
    })

    test('asign value to square', async () => {

        const matches: MatchStatusDTO[] = [mockMatch];
        const customBoard = mockMatch.board.map((square, index) => index === 0 ? { ...square, square_value: SquareValue.X } : square)

        const matchInProgress = {
            ...mockMatch,
            board: customBoard
        }
        vi.spyOn(matchApi, "getAllUserMatches").mockResolvedValue(matches);

        const { getByTestId } = render(
            <HomePage />
        )

        const squareOne = await waitFor(() => getByTestId('square-1'))

        userEvent.click(squareOne)

        vi.resetAllMocks()

        vi.spyOn(matchApi, "getMatchStatus").mockResolvedValue(matchInProgress);
        vi.spyOn(matchApi, "makeMove").mockResolvedValue(matchInProgress);

        await waitFor(async () => {
            const changedSquare = await waitFor(() => getByTestId('square-1'))
            expect(changedSquare).toHaveTextContent(SquareValue.X)
        })

    })


})


