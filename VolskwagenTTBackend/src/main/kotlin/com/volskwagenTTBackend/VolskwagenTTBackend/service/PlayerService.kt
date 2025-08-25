package com.volskwagenTTBackend.VolskwagenTTBackend.service

import com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto.ResponsePlayer
import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.PlayerEntity
import com.volskwagenTTBackend.VolskwagenTTBackend.repository.PlayerRepository
import org.apache.coyote.Response
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
open class PlayerService(
    private val playerRepository: PlayerRepository
) {

    private val passwordEncoder = BCryptPasswordEncoder();

    private val logger: Logger = LoggerFactory.getLogger(MatchService::class.java)

    @Transactional
    open fun register(username: String, email: String, password: String): ResponsePlayer {
        if (playerRepository.findByUsername(username) != null) {
            logger.error("Username $username already exists.")
            throw Exception("User with username $username already exists.")
        }

        val hashedPassword = passwordEncoder.encode(password)
        val playerEntity = PlayerEntity(username = username, email = email, password = hashedPassword)

        val dbPlayer = playerRepository.save(playerEntity)
        logger.info("player created with username $username and email $email")


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
            logger.info("User logged in with username $username")
            responsePlayer
        } else {
            logger.error("Username $username does not match with the password provided ")
            null
        }
    }


}