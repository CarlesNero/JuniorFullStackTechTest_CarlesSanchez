package com.volskwagenTTBackend.VolskwagenTTBackend.repository

import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.MatchEntity
import org.springframework.data.jpa.repository.JpaRepository

interface MatchRepository : JpaRepository<MatchEntity, Long> {
}