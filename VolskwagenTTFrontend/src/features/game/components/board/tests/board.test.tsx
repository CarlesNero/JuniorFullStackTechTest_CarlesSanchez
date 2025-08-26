import { describe, expect, vi } from 'vitest'

import '@testing-library/jest-dom'
import { Square, SquareValue } from '../../../interfaces/square'
import { MatchStatusDTO } from '../../../interfaces/match'
import Board from '../Board'
import { render, waitFor } from '@testing-library/react'
import userEvent from "@testing-library/user-event"


const mockSquares: Square[] = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    x: index % 3,
    y: Math.floor(index / 3),
    square_value: null as SquareValue
}))

const mockMatch: MatchStatusDTO = {
    id: 123,
    currentTurn: 'X',
    board: mockSquares,
    status: 'IN_PROGRESS'
}

describe('boardTest', () => {

    afterEach(() => {
        vi.clearAllMocks()
    })

    const props = {
        showModal: false,
        createNewMatch: vi.fn(),
        getMatchStatus: vi.fn(),
        makeMoveOnClick: vi.fn(),
        getAllUserMatches: vi.fn(),
        match: mockMatch,
        error: null,
    }


    test('Render error view', async () => {
        const testProps = {
            ...props,
            error: 'impossible to load the current Match',
        };
        const { getByText } = render(
            <Board {...testProps} />
        )

        const errorElemnt = await waitFor(() => getByText('impossible to load the current Match'))
        expect(errorElemnt).toBeInTheDocument();
    })


    test('Render no match view', async () => {
        const testProps = {
            ...props,
            match: null
        };
        const { getByText } = render(
            <Board {...testProps} />
        )

        const titleElemnt = await waitFor(() => getByText("You haven't started any game yet"))

        expect(titleElemnt).toBeInTheDocument();
    })


    test('Render match view', async () => {
        const testProps = {
            ...props
        };
        const { getByText } = render(
            <Board {...testProps} />
        )

        const titleElemnt = await waitFor(() => getByText("It's your turn player"))

        expect(titleElemnt).toBeInTheDocument();
    })


    test('user click on new Match button', async () => {

        const { getByText } = render(
            <Board {...props} />
        )

        const newGameButton = await waitFor(() => getByText('Create new game'))

        userEvent.click(newGameButton)
        await waitFor(() => {
            expect(props.createNewMatch).toHaveBeenCalled
        })

    })


    test('user click on square to make a move', async () => {
        const { findByTestId } = render(<Board {...props} />)

        const square = await findByTestId('square-1')
        await userEvent.click(square)

        await waitFor(() => {
            expect(props.makeMoveOnClick).toHaveBeenCalledWith(0,0)
        })
    })

})


