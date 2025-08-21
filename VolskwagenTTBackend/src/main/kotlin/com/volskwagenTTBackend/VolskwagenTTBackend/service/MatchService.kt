package com.volskwagenTTBackend.VolskwagenTTBackend.service

import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.MoveRequestDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.MatchStatusDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.MoveResponseDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.SquareDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.SquareResponseDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.MatchEntity
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.SquareEntity
import com.volskwagenTTBackend.VolskwagenTTBackend.repository.MatchRepository
import com.volskwagenTTBackend.VolskwagenTTBackend.repository.PlayerRepository
import com.volskwagenTTBackend.VolskwagenTTBackend.repository.SquareRepository
import org.springframework.stereotype.Service
import java.util.function.Supplier


@Service
class MatchService(
    private val matchRepository: MatchRepository,
    private val playerRepository: PlayerRepository,
    private val squareRepository: SquareRepository
) {


    // Function to create a new match with a 3x3 board

    fun createMatch(playerId: Long): MatchEntity {

        // Find the player by id, throw exception if not found
        val player = playerRepository.findById(playerId)
            .orElseThrow { RuntimeException("Player not found") }

        // Create the match with 'X' player turn
        val match = MatchEntity(
            player = player,
            currentTurn = "X",
            status = "IN_PROGRESS"
        )
        matchRepository.save(match)

        // Create the  table 3x3
        val squares = mutableListOf<SquareEntity>()
        for (x in 1..3) {
            for (y in 1..3) {
                val square = SquareEntity(
                    x = x,
                    y = y,
                    square_value = null, // All the squares start with null value
                    match = match
                )
                squares.add(square)
            }
        }
        squareRepository.saveAll(squares) // Save all squares to the db
        match.squares.addAll(squares) // Add squares to the match

        return match // Return the full match
    }


    // Function to make a move in the match
    fun makeMove(moveRequest: MoveRequestDTO): MoveResponseDTO {

        // Find match by Id, throw exception if not found
        val match = matchRepository.findById(moveRequest.matchId)
            .orElseThrow { RuntimeException("Match not found") }

        // If the match is already finished, return current state with error
        if (match.status != "IN_PROGRESS") {
            return matchToDTO(match, "Match already finished!")
        }

        // If it's not player turn, return current state with error
        if (match.currentTurn != moveRequest.playerId) {
            return matchToDTO(match, "Not your turn!")
        }

        // If the current x and y doesn't exist on the board, return current state with error
        val square = match.squares.firstOrNull() {
            it.x == moveRequest.square.x && it.y == moveRequest.square.y
        } ?: return matchToDTO(match, "Invalid square!")

        // If find the current square, but it already has a value, return current state with error
        if (square.square_value != null) {
            return matchToDTO(match, "Square already occupied!")
        }

        // Add the current player value to the square
        square.square_value = moveRequest.playerId

        // Save the square to the db
        squareRepository.save(square)

        // Check if the player has won with this move
        if (checkWinner(match, moveRequest.playerId)) {
            match.status = "WIN_${moveRequest.playerId}"
            matchRepository.save(match)
            return matchToDTO(match)
        }

        // Check for a draw if all squares are filled and the game hasn't ended with a win or lose
        if (match.squares.all { it.square_value != null }) {
            match.status = "DRAW"
            matchRepository.save(match)
            return matchToDTO(match)
        }

        // Change the current player turn
        match.currentTurn = if (moveRequest.playerId == "X") "O" else "X"

        // If it's the machine turn, make a move calling the makeMachineMove function
        if (match.currentTurn == "O") {
            makeMachineMove(match)
        }

        // Save the match and returns it
        matchRepository.save(match)
        return matchToDTO(match)

    }

    // Function for the machine to make a move
    private fun makeMachineMove(match: MatchEntity) {

        // Filter empty squares
        val emptySquares = match.squares.filter { it.square_value == null }

        // If there is an empty square, pick one at random
        if (emptySquares.isNotEmpty()) {
            val randomSquare = emptySquares.random()
            randomSquare.square_value = "O"
            squareRepository.save(randomSquare)
        }

        // Check if machine has won
        if (checkWinner(match, "O")) {
            match.status = "WIN_O"
            matchRepository.save(match)
            return
        }

        // Check if the match is a draw
        if (match.squares.all { it.square_value != null }) {
            match.status = "DRAW"
            matchRepository.save(match)
            return
        }

        // Change the current turn to the player
        match.currentTurn = "X"
        matchRepository.save(match)
    }


    // Function to check who has won the match
    private fun checkWinner(match: MatchEntity, player: String): Boolean {

        // Create a 3x3 board array
        val board = Array(3) { Array<String?>(3) { null } }
        match.squares.forEach { square ->
            board[square.x - 1][square.y - 1] = square.square_value
        }

        // Check rows and columns
        for (i in 0..2) {
            if ((0..2).all { board[i][it] == player }) return true
            if ((0..2).all { board[it][i] == player }) return true
        }

        // Check diagonals
        if ((0..2).all { board[it][it] == player }) return true
        if ((0..2).all { board[it][2 - it] == player }) return true

        return false

    }

    // Function to return current match status
    fun getMatchStatus(matchId: Long): MatchStatusDTO {

        val match: MatchEntity = matchRepository.findById(matchId)
            .orElseThrow<java.lang.RuntimeException?>(Supplier { java.lang.RuntimeException("Match not found") })

        return MatchStatusDTO(
            match.id,
            match.currentTurn,
            match.status,
            match.squares,
        )
    }


    // Function that converts match to MoveResponseDTO so /move can return the errors without breaking the game
    fun matchToDTO(match: MatchEntity, errorMessage: String? = null): MoveResponseDTO {
        val board = match.squares.map { square ->
            SquareResponseDTO(
                x = square.x,
                y = square.y,
                squareValue = square.square_value
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

    // Get all matches in the db
    fun getAllMatches(): List<MatchEntity> = matchRepository.findAll()

    // Get a match of the db by Id
    fun getMatchById(id: Long): MatchEntity =
        matchRepository.findById(id).orElseThrow { RuntimeException("Match not found") }
}
