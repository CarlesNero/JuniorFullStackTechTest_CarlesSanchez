package com.volskwagenTTBackend.VolskwagenTTBackend.repository

import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.PlayerEntity
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface PlayerRepository : JpaRepository<PlayerEntity, Long>{

    fun findByUsername(username: String): PlayerEntity?
    fun existsByEmail(email: String): Boolean
    fun existsByUsername(username: String): Boolean
    fun findByEmail(email: String, pageable: Pageable): Page<PlayerEntity>
}