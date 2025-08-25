package com.volskwagenTTBackend.VolskwagenTTBackend

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.MoveRequestDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.SquareDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.MatchEntity
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.PlayerEntity
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.SquareEntity
import com.volskwagenTTBackend.VolskwagenTTBackend.repository.MatchRepository
import com.volskwagenTTBackend.VolskwagenTTBackend.repository.PlayerRepository
import com.volskwagenTTBackend.VolskwagenTTBackend.repository.SquareRepository
import com.volskwagenTTBackend.VolskwagenTTBackend.service.MatchService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.assertThrows
import org.mockito.Mock
import org.mockito.MockitoAnnotations
import org.mockito.Mockito.*
import java.util.*
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

@SpringBootTest
class VolskwagenTtBackendApplicationTests {

    @Mock
    private lateinit var matchRepository: MatchRepository

    @Mock
    private lateinit var playerRepository: PlayerRepository

    @Mock
    private lateinit var squareRepository: SquareRepository

    private lateinit var matchService: MatchService
    private lateinit var mockPlayer: PlayerEntity
    private lateinit var mockMatch: MatchEntity

    @BeforeEach
    fun setUp() {
        MockitoAnnotations.openMocks(this)
        matchService = MatchService(matchRepository, playerRepository, squareRepository)

        mockPlayer = PlayerEntity(
            id = 1L,
            username = "admin",
            email = "admin@gmail.com",
            password = "admin"
        )

        mockMatch = createMockMatch()
    }


    private fun createMockMatch(): MatchEntity {
        val match = MatchEntity(
            id = 1L,
            player = mockPlayer,
            currentTurn = "X",
            status = "IN_PROGRESS"
        )

        val squares = mutableListOf<SquareEntity>()
        for (x in 1..3) {
            for (y in 1..3) {
                squares.add(
                    SquareEntity(
                        x = x,
                        y = y,
                        square_value = null,
                        match = match
                    )
                )
            }
        }
        match.squares.addAll(squares)
        return match
    }

    @Test
    fun contextLoads() {
    }

    @Test
    fun `makeMove - valid movement on players turn`() {
        val moveRequest = MoveRequestDTO(1L, "X", SquareDTO(1, 1))

        `when`(matchRepository.findById(1L)).thenReturn(Optional.of(mockMatch))
        `when`(squareRepository.save(any())).thenAnswer { it.getArgument<SquareEntity>(0) }
        `when`(matchRepository.save(any())).thenAnswer { it.getArgument<MatchEntity>(0) }

        val result = matchService.makeMove(moveRequest)

        assertEquals(1L, result.matchId)
        assertEquals("X", result.currentTurn)
        verify(squareRepository, atLeastOnce()).save(any())

    }


    @Test
    fun `makeMove - error when its not players turn`() {

        mockMatch.currentTurn = "O"


        val moveRequest = MoveRequestDTO(
            matchId = 1L,
            playerId = "X",
            square = SquareDTO(1, 1)
        )

        `when`(matchRepository.findById(1L)).thenReturn(Optional.of(mockMatch))


        val result = matchService.makeMove(moveRequest)


        assertEquals("Not your turn!", result.error)
        assertEquals("O", mockMatch.currentTurn)
        verify(squareRepository, never()).save(any())
    }


    @Test
    fun `makeMove - error on finished match`() {
        mockMatch.status = "WIN_X"
        val moveRequest = MoveRequestDTO(1L, "X", SquareDTO(1, 1))
        `when`(matchRepository.findById(1L)).thenReturn(Optional.of(mockMatch))

        val result = matchService.makeMove(moveRequest)

        assertEquals("Match already finished!", result.error)
        verify(squareRepository, never()).save(any())
    }

    @Test
    fun `makeMove - error when the square is not empty`() {
        mockMatch.squares[0].square_value = "O"
        val moveRequest = MoveRequestDTO(1L, "X", SquareDTO(1, 1))
        `when`(matchRepository.findById(1L)).thenReturn(Optional.of(mockMatch))

        val result = matchService.makeMove(moveRequest)

        assertEquals("Square already occupied!", result.error)
        verify(squareRepository, never()).save(any())
    }

    @Test
    fun `makeMove - error when non valid coordinates`() {
        val moveRequest = MoveRequestDTO(1L, "X", SquareDTO(5, 5))
        `when`(matchRepository.findById(1L)).thenReturn(Optional.of(mockMatch))


        val result = matchService.makeMove(moveRequest)

        assertEquals("Invalid square!", result.error)
        verify(squareRepository, never()).save(any())
    }

    @Test
    fun `makeMove - exception when the match doesn't exist`() {
        val moveRequest = MoveRequestDTO(999L, "X", SquareDTO(1, 1))
        `when`(playerRepository.findById(999L)).thenReturn(Optional.empty())

        assertThrows<RuntimeException> { matchService.makeMove(moveRequest) }
    }

    @Test
    fun `checkWinner - win on horizontal`() {
        mockMatch.squares[0].square_value = "X"
        mockMatch.squares[1].square_value = "X"
        mockMatch.squares[2].square_value = "X"
        assertTrue(callCheckWinner(mockMatch, "X"))
    }

    @Test
    fun `checkWinner - win on vertical`() {
        mockMatch.squares[0].square_value = "O"
        mockMatch.squares[3].square_value = "O"
        mockMatch.squares[6].square_value = "O"
        assertTrue(callCheckWinner(mockMatch, "O"))
    }

    @Test
    fun `checkWinner - win on diagonal`() {
        mockMatch.squares[0].square_value = "X"
        mockMatch.squares[4].square_value = "X"
        mockMatch.squares[8].square_value = "X"
        assertTrue(callCheckWinner(mockMatch, "X"))
    }

    @Test
    fun `checkWinner - win on secondary diagonal`() {
        mockMatch.squares[2].square_value = "O"
        mockMatch.squares[4].square_value = "O"
        mockMatch.squares[6].square_value = "O"
        assertTrue(callCheckWinner(mockMatch, "O"))
    }

    @Test
    fun `checkWinner - doesnt detect win if the line isn't complete`() {
        mockMatch.squares[0].square_value = "X"
        mockMatch.squares[1].square_value = "X"
        mockMatch.squares[3].square_value = "O"
        assertFalse(callCheckWinner(mockMatch, "X"))
    }


    @Test
    fun `makeMachineMove - machine make a move on empty square`() {
        `when`(squareRepository.save(any())).thenReturn(mockMatch.squares[0])
        `when`(matchRepository.save(any())).thenReturn(mockMatch)

        callMakeMachineMove(mockMatch)

        val machineSquares = mockMatch.squares.filter { it.square_value == "O" }
        assertEquals(1, machineSquares.size)
        assertEquals("X", mockMatch.currentTurn)
        verify(squareRepository).save(any())
    }

    @Test
    fun `makeMachineMove - machine win the game`() {
        val spyService = spy(matchService)

        mockMatch.squares[0].square_value = "O"
        mockMatch.squares[1].square_value = "O"


        doReturn(mockMatch.squares[2]).`when`(spyService).pickMachineSquare(mockMatch)


        `when`(squareRepository.save(any())).thenAnswer { it.getArgument<SquareEntity>(0) }
        `when`(matchRepository.save(any())).thenAnswer { it.getArgument<MatchEntity>(0) }


        val method = MatchService::class.java.getDeclaredMethod("makeMachineMove", MatchEntity::class.java)
        method.isAccessible = true
        method.invoke(spyService, mockMatch)


        assertEquals("WIN_O", mockMatch.status)
        assertEquals("O", mockMatch.squares[2].square_value)
        verify(matchRepository, atLeastOnce()).save(mockMatch)
    }



    @Test
    fun `makeMachineMove - tie on full board`() {
        for (i in 0..7) mockMatch.squares[i].square_value = if (i % 2 == 0) "X" else "O"
        `when`(squareRepository.save(any())).thenReturn(mockMatch.squares[8])
        `when`(matchRepository.save(any())).thenReturn(mockMatch)

        callMakeMachineMove(mockMatch)

        assertEquals("DRAW", mockMatch.status)
        verify(matchRepository, atLeastOnce()).save(mockMatch)
    }

    @Test
    fun `makeMachineMove - doesn't allow movement on full board`() {
        mockMatch.squares.forEach { it.square_value = "X" }
        `when`(matchRepository.save(any())).thenReturn(mockMatch)

        callMakeMachineMove(mockMatch)

        assertEquals("DRAW", mockMatch.status)
        verify(squareRepository, never()).save(any())
    }

    private fun callCheckWinner(match: MatchEntity, player: String): Boolean {
        val method =
            MatchService::class.java.getDeclaredMethod("checkWinner", MatchEntity::class.java, String::class.java)
        method.isAccessible = true
        return method.invoke(matchService, match, player) as Boolean
    }

    private fun callMakeMachineMove(match: MatchEntity) {
        val method = MatchService::class.java.getDeclaredMethod("makeMachineMove", MatchEntity::class.java)
        method.isAccessible = true
        method.invoke(matchService, match)
    }
}
