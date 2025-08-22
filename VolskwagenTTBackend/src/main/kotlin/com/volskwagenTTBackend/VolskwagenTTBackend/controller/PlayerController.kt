package com.volskwagenTTBackend.VolskwagenTTBackend.controller

import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.LoginPLayerDTO
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.PlayerEntity
import com.volskwagenTTBackend.VolskwagenTTBackend.repository.PlayerRepository
import com.volskwagenTTBackend.VolskwagenTTBackend.service.PlayerService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/player")
class PlayerController(
    private val playerService: PlayerService,
    private val playerRepository: PlayerRepository
) {


    @GetMapping
    fun getPlayers(): ResponseEntity<List<PlayerEntity>> {
        val players = playerRepository.findAll()

        return ResponseEntity.ok(players);
    }

    @GetMapping("/{id}")
    fun getPlayerById(@PathVariable("id") id: Long): ResponseEntity<PlayerEntity> {
        val player = playerRepository.findById(id)
        return ResponseEntity.ok(player.get());
    }


    @PostMapping("/register")
    fun register(@RequestBody newPlayer: PlayerEntity): ResponseEntity<Any> {
        if (playerRepository.existsByEmail(newPlayer.email)) {
            return ResponseEntity
                .badRequest()
                .body(mapOf("error" to "Email already in use"))
        }

        if (playerRepository.existsByUsername(newPlayer.username)) {
            return ResponseEntity
                .badRequest()
                .body(mapOf("error" to "Username already in use"))
        }

        val savedPlayer = playerService.register(
            newPlayer.username, newPlayer.email, newPlayer.password
        )

        return ResponseEntity.ok(savedPlayer)
    }


    @PostMapping("/login")
    fun login(@RequestBody loginData: LoginPLayerDTO): ResponseEntity<Any> {
        val player = playerService.login(loginData.username, loginData.password)

        return if (player != null) {
            ResponseEntity.ok(player)
        } else {
            ResponseEntity.badRequest().body(mapOf("error" to "Invalid username or password"))
        }
    }





}