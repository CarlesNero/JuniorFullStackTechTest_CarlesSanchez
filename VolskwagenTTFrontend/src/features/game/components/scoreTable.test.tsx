import { describe, expect, vi } from 'vitest'

import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react'
import { Square, SquareValue } from '../interfaces/square'
import { MatchStatusDTO } from '../interfaces/match'
import ScoreTable from './ScoreTable'


const mockSquares: Square[] = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    x: index % 3,
    y: Math.floor(index / 3),
    square_value: null as SquareValue
}))


const mockMatches: MatchStatusDTO[] = [
    {
        id: 2,
        currentTurn: 'X',
        board: mockSquares,
        status: 'IN_PROGRESS'
    },
    {
        id: 2,
        currentTurn: 'X',
        board: mockSquares,
        status: 'WIN_X'
    },
    {
        id: 3,
        currentTurn: 'O',
        board: mockSquares,
        status: 'WIN_O'
    },
    {
        id: 4,
        currentTurn: 'X',
        board: mockSquares,
        status: 'DRAW'
    }
]


describe('boardTest', () => {

    afterEach(() => {
        vi.clearAllMocks()
    })

    const props = {
        matches: mockMatches
    }


    test('Render score table view', async () => {
        const testProps = {
            ...props,
            error: 'impossible to load the current Match',
        };
        const { getByText } = render(
            <ScoreTable {...testProps} />
        )

        const errorElemnt = await waitFor(() => getByText('Stadistics'))
        expect(errorElemnt).toBeInTheDocument();
    })

    describe('ScoreTable', () => {
        it('renders the correct statistics', async () => {
            const {getByText} = render(<ScoreTable matches={mockMatches} />)

            await waitFor(() => {
                expect(getByText('Stadistics')).toBeInTheDocument()
                expect(getByText('Games played:').nextSibling?.textContent).toBe('4')
                expect(getByText('Victories:').nextSibling?.textContent).toBe('1')
                expect(getByText('Ties:').nextSibling?.textContent).toBe('1')
                expect(getByText('Loses:').nextSibling?.textContent).toBe('1')
                expect(getByText('Unfinished:').nextSibling?.textContent).toBe('1')
            })
        })

    })

})
