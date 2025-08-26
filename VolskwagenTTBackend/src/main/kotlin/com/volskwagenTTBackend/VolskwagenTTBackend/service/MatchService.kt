package com.volskwagenTTBackend.VolskwagenTTBackend.service

import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.MoveRequestDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.MatchStatusDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.MoveResponseDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.SquareResponseDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.MatchEntity
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.SquareEntity
import com.volskwagenTTBackend.VolskwagenTTBackend.repository.MatchRepository
import com.volskwagenTTBackend.VolskwagenTTBackend.repository.PlayerRepository
import com.volskwagenTTBackend.VolskwagenTTBackend.repository.SquareRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.util.function.Supplier
import org.slf4j.Logger
import org.slf4j.LoggerFactory


@Service
class MatchService(
    private val matchRepository: MatchRepository,
    private val playerRepository: PlayerRepository
) {

    private val logger: Logger = LoggerFactory.getLogger(MatchService::class.java)


    // Function to create a new match with a 3x3 board
    @Transactional
    fun createMatch(playerId: Long): MatchEntity {


        logger.info("Creating new match for playerId=$playerId")
        val player = playerRepository.findById(playerId)
            .orElseThrow {
                logger.error("Player with id=$playerId not found")
                RuntimeException("Player not found")
            }


        val match = MatchEntity(
            player = player,
            currentTurn = "X",
            status = "IN_PROGRESS",
        )
        matchRepository.save(match)

        // Create the  table 3x3
        val board = mutableListOf<SquareEntity>()
        for (x in 1..3) {
            for (y in 1..3) {
                val square = SquareEntity(
                    x = x,
                    y = y,
                    square_value = null,
                    match = match
                )
                board.add(square)
            }
        }
        match.board.addAll(board)

        logger.info("Match created with id: ${match.id} and empty board")
        return match
    }


    // Function to make a move in the match
    @Transactional
    fun makeMove(moveRequestDTO: MoveRequestDTO): MoveResponseDTO {
        val match = matchRepository.findById(moveRequestDTO.matchId)
            .orElseThrow { RuntimeException("Match not found") }

        if (match.status != "IN_PROGRESS") {
            return matchToDTO(match, "Match already finished!")
        }

        if (match.currentTurn != moveRequestDTO.playerId) {
            return matchToDTO(match, "Not your turn!")
        }

        val square = match.board.firstOrNull {
            it.x == moveRequestDTO.square.x && it.y == moveRequestDTO.square.y
        } ?: return matchToDTO(match, "Invalid square!")

        if (square.square_value != null) {
            return matchToDTO(match, "Square already occupied!")
        }


        square.square_value = moveRequestDTO.playerId


        if (checkWinner(match, moveRequestDTO.playerId)) {
            match.status = "WIN_${moveRequestDTO.playerId}"
        } else if (match.board.all { it.square_value != null }) {
            match.status = "DRAW"
        } else {
            match.currentTurn = if (moveRequestDTO.playerId == "X") "O" else "X"
            if (match.currentTurn == "O") {
                makeMachineMove(match)
            }
        }


        return matchToDTO(match)
    }


    // Function for the machine to make a move
    fun makeMachineMove(match: MatchEntity) {


        // If there is an empty square, pick one at random
        val chosenSquare = pickMachineSquare(match)
        chosenSquare?.let {
            it.square_value = "O"
            /*squareRepository.save(it)*/
            logger.info("Machine placed 'O' at (${it.x}, ${it.y}) in match ${match.id}")
        } ?: run {
            logger.warn("No empty squares available for machine in match ${match.id}")
            return
        }


        if (checkWinner(match, "O")) {
            match.status = "WIN_O"
            /*matchRepository.save(match)*/
            logger.info("Machine wins match ${match.id}")
            return
        }


        if (match.board.all { it.square_value != null }) {
            match.status = "DRAW"
            /*matchRepository.save(match)*/
            logger.info("Match ${match.id} ended in a draw")
            return
        }


        match.currentTurn = "X"
        /*matchRepository.save(match)*/
        logger.info("Turn changed to player 'X' in match ${match.id}")
    }


    // Function to check who has won the match
    private fun checkWinner(match: MatchEntity, player: String): Boolean {


        val board = Array(3) { Array<String?>(3) { null } }
        match.board.forEach { square ->
            board[square.x - 1][square.y - 1] = square.square_value
        }

        logger.debug("Checking winner for player=$player in match=${match.id}")

        // Check rows and columns
        for (i in 0..2) {
            if ((0..2).all { board[i][it] == player }) return true

            if ((0..2).all { board[it][i] == player }) {
                logger.info("Player $player wins by column $i in match=${match.id}")
                return true
            }
        }

        // Check diagonals
        if ((0..2).all { board[it][it] == player }) {
            logger.info("Player $player wins by main diagonal in match=${match.id}")
            return true
        }
        if ((0..2).all { board[it][2 - it] == player }) {
            logger.info("Player $player wins by secondary diagonal in match=${match.id}")
            return true
        }

        return false

    }

    // Function to return current match status
    fun getMatchStatus(matchId: Long): MatchStatusDTO {

        val match = matchRepository.findById(matchId)
            .orElseThrow {
                logger.error("Match with id=$matchId not found")
                RuntimeException("Match not found")
            }
        return MatchStatusDTO(
            match.id,
            match.currentTurn,
            match.status,
            match.board,
        )
    }


    // Function that converts match to MoveResponseDTO so /move can return the errors without breaking the game
    fun matchToDTO(match: MatchEntity, errorMessage: String? = null): MoveResponseDTO {
        val board = match.board.map { square ->
            SquareResponseDTO(
                x = square.x,
                y = square.y,
                square_value = square.square_value
            )
        }

        return MoveResponseDTO(
            matchId = match.id!!,
            board = board,
            currentTurn = match.currentTurn,
            status = match.status,
            error = errorMessage
        )
    }


    fun getAllMatches(): List<MatchEntity> = matchRepository.findAll()


    fun getMatchById(id: Long): MatchEntity =
        matchRepository.findById(id).orElseThrow { RuntimeException("Match not found") }

    // Get all matches by player Id
    fun getMatchesByPlayer(playerId: Long): List<MatchStatusDTO> {

        val matches = matchRepository.findByPlayerId(playerId)

        return matches.map { match ->
            MatchStatusDTO(
                id = match.id,
                currentTurn = match.currentTurn,
                status = match.status,
                board = match.board,
            )
        }
    }

    // Method to mock the square for the machine movement
    open fun pickMachineSquare(match: MatchEntity): SquareEntity? {
        val emptySquares = match.board.filter { it.square_value == null }
        return if (emptySquares.isNotEmpty()) emptySquares.random() else null
    }

}
