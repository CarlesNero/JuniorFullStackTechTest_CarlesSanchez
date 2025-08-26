package com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto

import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.SquareEntity

data class MatchStatusDTO(
    val id: Long?,
    val currentTurn: String,
    val status: String,
    val board: List<SquareEntity>
)
