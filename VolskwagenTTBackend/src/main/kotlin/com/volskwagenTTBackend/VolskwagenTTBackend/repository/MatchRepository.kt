package com.volskwagenTTBackend.VolskwagenTTBackend.repository

import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.MatchEntity
import org.springframework.data.jpa.repository.JpaRepository

interface MatchRepository : JpaRepository<MatchEntity, Long> {
    fun findByPlayerId(playerId: Long): MutableList<MatchEntity>

    interface MatchRepository : JpaRepository<MatchEntity, Long> {
        fun findByPlayerId(playerId: Long): List<MatchEntity>
    }

}