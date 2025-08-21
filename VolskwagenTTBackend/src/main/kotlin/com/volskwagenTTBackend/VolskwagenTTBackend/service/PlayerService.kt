package com.volskwagenTTBackend.VolskwagenTTBackend.service

import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.PlayerEntity
import com.volskwagenTTBackend.VolskwagenTTBackend.repository.PlayerRepository
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
open class PlayerService(
    private val playerRepository: PlayerRepository
) {

    private val passwordEncoder = BCryptPasswordEncoder();

    @Transactional
    open fun register(username: String, email: String, password: String): PlayerEntity {
        if (playerRepository.findByUsername(username) != null) {
            throw Exception("User with username $username already exists.")
        }

        val hashedPassword = passwordEncoder.encode(password)
        val playerEntity = PlayerEntity(username = username, email = email, password = hashedPassword)

        return playerRepository.save(playerEntity)
    }


    fun login(username: String, password: String): PlayerEntity? {
        val player = playerRepository.findByUsername(username) ?: return null

        return if (passwordEncoder.matches(password, player.password)) {
            player
        } else {
            null
        }
    }


}