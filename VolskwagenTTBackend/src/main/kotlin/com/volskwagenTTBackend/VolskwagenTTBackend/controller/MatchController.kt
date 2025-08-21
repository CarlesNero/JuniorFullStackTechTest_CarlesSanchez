package com.volskwagenTTBackend.VolskwagenTTBackend.controller

import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.MatchStatusDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.MoveRequestDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.MoveResponseDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.MatchEntity
import com.volskwagenTTBackend.VolskwagenTTBackend.service.MatchService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/match")
class MatchController(private val matchService: MatchService) {

    // Endpoint to create a new match for a given player.
    // The playerId is passed as a requestParam.
    // Returns the created MatchEntity including the empty board and initial status.
    @PostMapping("/create")
    fun createMatch(@RequestParam playerId: Long): ResponseEntity<Map<String, Long>> {
        val match = matchService.createMatch(playerId)
        // Return the match id
        return ResponseEntity.ok(mapOf("matchId" to match.id!!))
    }

    // Endpoint to retrieve all matches in the system.
    // Returns a list of MatchEntity objects.
    @GetMapping("")
    fun getAllMatches(): ResponseEntity<List<MatchEntity>> {
        val matches = matchService.getAllMatches()
        return ResponseEntity.ok(matches)
    }


    // Endpoint to retrieve a specific match by its ID.
    // The match ID is passed as a path variable.
    // Returns the MatchEntity corresponding to the given ID.
    @GetMapping("/{id}")
    fun getMatchById(@PathVariable id: Long): ResponseEntity<MatchEntity> {
        val match = matchService.getMatchById(id)
        return ResponseEntity.ok(match)
    }

    // Endpoint to make a move in a match.
    // Receives a MoveRequestDTO containing the matchId, playerId, and target square.
    // Returns a MoveResponseDTO with the updated board, current turn, match status,
    // and any possible error messages (e.g., invalid move, not your turn).
    @PostMapping("/move")
    fun makeMove(@RequestBody moveRequest: MoveRequestDTO): ResponseEntity<MoveResponseDTO> {
        val updateMatch = matchService.makeMove(moveRequest)
        return ResponseEntity.ok(updateMatch)
    }

    // Endpoint to get the current status of a specific match.
    // The matchId is passed as a requestParam
    // Returns a MatchStatusDTO containing the board, current turn, and match status.
    @GetMapping("/status")
    fun getMatchStatus(@RequestParam matchId: Long): ResponseEntity<MatchStatusDTO> {
        val response: MatchStatusDTO = matchService.getMatchStatus(matchId)
        return ResponseEntity.ok(response)
    }

}
