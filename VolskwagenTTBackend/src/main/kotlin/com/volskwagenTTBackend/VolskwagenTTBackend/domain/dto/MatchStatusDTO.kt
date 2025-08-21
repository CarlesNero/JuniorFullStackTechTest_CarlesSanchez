package com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto

import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.SquareEntity

data class MatchStatusDTO(
    val matchId: Long?,
    val playerTurn: String,
    val status: String,
    val squares: List<SquareEntity>
)
