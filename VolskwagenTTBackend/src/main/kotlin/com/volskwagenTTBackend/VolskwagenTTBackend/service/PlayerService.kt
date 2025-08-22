package com.volskwagenTTBackend.VolskwagenTTBackend.service

import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.ResponsePlayer
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.PlayerEntity
import com.volskwagenTTBackend.VolskwagenTTBackend.repository.PlayerRepository
import org.apache.coyote.Response
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
open class PlayerService(
    private val playerRepository: PlayerRepository
) {

    private val passwordEncoder = BCryptPasswordEncoder();

    @Transactional
    open fun register(username: String, email: String, password: String): ResponsePlayer {
        if (playerRepository.findByUsername(username) != null) {
            throw Exception("User with username $username already exists.")
        }

        val hashedPassword = passwordEncoder.encode(password)
        val playerEntity = PlayerEntity(username = username, email = email, password = hashedPassword)


        val dbPlayer = playerRepository.save(playerEntity)


        val responsePlayer = ResponsePlayer(
            id = dbPlayer.id,
            username = dbPlayer.username,
            email = dbPlayer.email
        )
        return responsePlayer
    }


    fun login(username: String, password: String): ResponsePlayer? {
        val player = playerRepository.findByUsername(username) ?: return null

        val responsePlayer = ResponsePlayer(
            id = player.id,
            username = player.username,
            email = player.email
        )

        return if (passwordEncoder.matches(password, player.password)) {
            responsePlayer
        } else {
            null
        }
    }


}