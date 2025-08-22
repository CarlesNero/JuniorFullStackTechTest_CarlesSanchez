import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useMatch } from '../useMatch'
import { createMatch, getMatchStatus, makeMove, getAllUserMatches } from '../../api/matchApi'
import type { MatchStatusDTO, MoveRequestDTO, Match } from '../../interfaces/match'
import type { Player } from '../../interfaces/player'
import type { Square, SquareValue } from '../../interfaces/square'


vi.mock('../../api/matchApi', () => ({
  createMatch: vi.fn(),
  getMatchStatus: vi.fn(),
  makeMove: vi.fn(),
  getAllUserMatches: vi.fn(),
}))


const mockCreateMatch = createMatch as MockedFunction<typeof createMatch>
const mockGetMatchStatus = getMatchStatus as MockedFunction<typeof getMatchStatus>
const mockMakeMove = makeMove as MockedFunction<typeof makeMove>
const mockGetAllUserMatches = getAllUserMatches as MockedFunction<typeof getAllUserMatches>

describe('useMatch', () => {
  const playerId = 1
  
  const mockPlayer: Player = {
    id: playerId,
    username: 'testuser',
    email: 'test@example.com'
  }

  const mockSquares: Square[] = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    x: index % 3,
    y: Math.floor(index / 3),
    square_value: null as SquareValue
  }))

  const mockMatch: MatchStatusDTO = {
    matchId: 123,
    playerTurn: 'X',
    squares: mockSquares,
    status: 'IN_PROGRESS'
  }

  const mockMatchData: Match = {
    id: 123,
    player: mockPlayer,
    squares: mockSquares,
    currentTurn: 'X',
    status: 'IN_PROGRESS'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockGetAllUserMatches.mockResolvedValue([mockMatchData])
    mockGetMatchStatus.mockResolvedValue(mockMatch)
  })

  describe('Initial state', () => {
    it('should initialize with correct default values', async () => {
      vi.clearAllMocks()
      
     
      mockGetAllUserMatches.mockResolvedValueOnce([])
      
      const { result } = renderHook(() => useMatch(playerId))

      
      await act(async () => {
        await Promise.resolve()
      })

      expect(result.current.match).toBeNull()
      expect(result.current.showModal).toBe(false)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('fetchLastMatch', () => {
    it('should fetch and set the last match on mount', async () => {
      const { result } = renderHook(() => useMatch(playerId))

      await waitFor(() => {
        expect(result.current.match).toEqual({
          matchId: 123,
          playerTurn: 'X',
          squares: mockSquares,
          status: 'IN_PROGRESS'
        })
      })

      expect(mockGetAllUserMatches).toHaveBeenCalledWith(playerId)
      expect(result.current.isLoading).toBe(false)
    })

    it('should set match to null when no matches exist', async () => {
      mockGetAllUserMatches.mockResolvedValueOnce([])
      
      const { result } = renderHook(() => useMatch(playerId))

      await waitFor(() => {
        expect(result.current.match).toBeNull()
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('should handle errors when fetching matches', async () => {
      const errorMessage = 'API Error'
      mockGetAllUserMatches.mockRejectedValueOnce(new Error(errorMessage))

      const { result } = renderHook(() => useMatch(playerId))

      await waitFor(() => {
        expect(result.current.error).toBe('Error loading matches')
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('should set loading state correctly during fetch', async () => {
      let resolvePromise: (value: Match[]) => void
      const promise = new Promise<Match[]>((resolve) => {
        resolvePromise = resolve
      })
      mockGetAllUserMatches.mockReturnValueOnce(promise)

      const { result } = renderHook(() => useMatch(playerId))

      
      expect(result.current.isLoading).toBe(true)

     
      act(() => {
        resolvePromise!([mockMatchData])
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('createNewMatch', () => {
    it('should create a new match successfully', async () => {
      mockCreateMatch.mockResolvedValueOnce({ matchId: 456 })
      const newMatchData = { ...mockMatch, matchId: 456 }
      mockGetMatchStatus.mockResolvedValueOnce(newMatchData)

      const { result } = renderHook(() => useMatch(playerId))

      await act(async () => {
        await result.current.createNewMatch()
      })

      expect(mockCreateMatch).toHaveBeenCalledWith(playerId)
      expect(mockGetMatchStatus).toHaveBeenCalledWith(456)
      expect(result.current.match).toEqual(newMatchData)
      expect(result.current.showModal).toBe(false)
    })

    it('should handle errors when creating a match', async () => {
      mockCreateMatch.mockRejectedValueOnce(new Error('Create failed'))

      const { result } = renderHook(() => useMatch(playerId))

      await act(async () => {
        await result.current.createNewMatch()
      })

      expect(result.current.error).toBe('Error creating new match')
      expect(result.current.isLoading).toBe(false)
    })

    it('should set loading state during match creation', async () => {
      let resolveCreatePromise: (value: { matchId: number }) => void
      const createPromise = new Promise<{ matchId: number }>((resolve) => {
        resolveCreatePromise = resolve
      })
      mockCreateMatch.mockReturnValueOnce(createPromise)

      const { result } = renderHook(() => useMatch(playerId))

      
      act(() => {
        result.current.createNewMatch()
      })

      
      expect(result.current.isLoading).toBe(true)

    
      act(() => {
        resolveCreatePromise!({ matchId: 456 })
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('makeMoveOnClick', () => {
    it('should make a move successfully and update match', async () => {
      const updatedSquares: Square[] = mockSquares.map((square, index) => 
        index === 0 ? { ...square, square_value: 'X' as SquareValue } : square
      )
      const updatedMatch: MatchStatusDTO = { 
        ...mockMatch, 
        squares: updatedSquares 
      }
      
      mockMakeMove.mockResolvedValueOnce({ success: true } as any)
      mockGetMatchStatus.mockResolvedValueOnce(updatedMatch)

      const { result } = renderHook(() => useMatch(playerId))

      await waitFor(() => {
        expect(result.current.match).toBeTruthy()
      })

      await act(async () => {
        await result.current.makeMoveOnClick(0, 0)
      })

      const expectedMoveRequest: MoveRequestDTO = {
        matchId: 123,
        playerId: 'X',
        square: { x: 0, y: 0 }
      }

      expect(mockMakeMove).toHaveBeenCalledWith(expectedMoveRequest)
      expect(mockGetMatchStatus).toHaveBeenCalledWith(123)
      expect(result.current.match).toEqual(updatedMatch)
      expect(result.current.showModal).toBe(false) // Still in progress
    })

    it('should show modal when game ends', async () => {
      const finishedMatch = { ...mockMatch, status: 'PLAYER_X_WINS' as const }
      mockMakeMove.mockResolvedValueOnce({ success: true } as any)
      mockGetMatchStatus.mockResolvedValueOnce(finishedMatch)

      const { result } = renderHook(() => useMatch(playerId))

      await waitFor(() => {
        expect(result.current.match).toBeTruthy()
      })

      await act(async () => {
        await result.current.makeMoveOnClick(0, 0)
      })

      expect(result.current.showModal).toBe(true)
    })

    it('should not make move if no match exists', async () => {
      mockGetAllUserMatches.mockResolvedValueOnce([])
      
      const { result } = renderHook(() => useMatch(playerId))

      await waitFor(() => {
        expect(result.current.match).toBeNull()
      })

      await act(async () => {
        await result.current.makeMoveOnClick(0, 0)
      })

      expect(mockMakeMove).not.toHaveBeenCalled()
    })

    it('should handle errors when making a move', async () => {
      mockMakeMove.mockRejectedValueOnce(new Error('Move failed'))

      const { result } = renderHook(() => useMatch(playerId))

      await waitFor(() => {
        expect(result.current.match).toBeTruthy()
      })

      await act(async () => {
        await result.current.makeMoveOnClick(0, 0)
      })

      expect(result.current.error).toBe('Error making move')
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('Modal and error management', () => {
    it('should close modal when closeModal is called', async () => {
      const { result } = renderHook(() => useMatch(playerId))

      await act(async () => {
        result.current.closeModal()
      })

      expect(result.current.showModal).toBe(false)
    })

    it('should clear error when clearError is called', async () => {
      mockGetAllUserMatches.mockRejectedValueOnce(new Error('API Error'))

      const { result } = renderHook(() => useMatch(playerId))

      await act(async () => {
        await Promise.resolve() 
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('Edge cases', () => {
    it('should handle multiple rapid calls to createNewMatch', async () => {
      mockCreateMatch.mockResolvedValue({ matchId: 789 })
      const newMatch = { ...mockMatch, matchId: 789 }
      mockGetMatchStatus.mockResolvedValue(newMatch)

      const { result } = renderHook(() => useMatch(playerId))

      await act(async () => {
        const promises = [
          result.current.createNewMatch(),
          result.current.createNewMatch(),
          result.current.createNewMatch()
        ]
        await Promise.all(promises)
      })

      expect(mockCreateMatch).toHaveBeenCalledTimes(3)
    })

    it('should handle multiple rapid moves', async () => {
      const mockSquares: Square[] = Array.from({ length: 9 }, (_, index) => ({
        id: index + 1,
        x: index % 3,
        y: Math.floor(index / 3),
        square_value: null as SquareValue
      }))
      const mockMatch: MatchStatusDTO = {
        matchId: 123,
        playerTurn: 'X',
        squares: mockSquares,
        status: 'IN_PROGRESS'
      }
      mockMakeMove.mockResolvedValue({ success: true } as any)
      mockGetMatchStatus.mockResolvedValue(mockMatch)

      const { result } = renderHook(() => useMatch(playerId))

      await waitFor(() => {
        expect(result.current.match).toBeTruthy()
      })

      await act(async () => {
        const promises = [
          result.current.makeMoveOnClick(0, 0),
          result.current.makeMoveOnClick(0, 1),
          result.current.makeMoveOnClick(1, 0)
        ]
        await Promise.all(promises)
      })

      expect(mockMakeMove).toHaveBeenCalledTimes(3)
    })
  })

  describe('Function stability', () => {
    it('should maintain function reference stability', async () => {
      const { result, rerender } = renderHook(() => useMatch(playerId))

      await act(async () => {
        await Promise.resolve()
      })

      const firstRenderFunctions = {
        createNewMatch: result.current.createNewMatch,
        makeMoveOnClick: result.current.makeMoveOnClick,
        fetchLastMatch: result.current.fetchLastMatch,
        closeModal: result.current.closeModal,
        clearError: result.current.clearError
      }

      await act(async () => {
        rerender()
      })

      expect(result.current.createNewMatch).toBe(firstRenderFunctions.createNewMatch)
      expect(result.current.makeMoveOnClick).toBe(firstRenderFunctions.makeMoveOnClick)
      expect(result.current.fetchLastMatch).toBe(firstRenderFunctions.fetchLastMatch)
      expect(result.current.closeModal).toBe(firstRenderFunctions.closeModal)
      expect(result.current.clearError).toBe(firstRenderFunctions.clearError)
    })
  })
})

