package com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto

data class MoveResponseDTO(
    val matchId: Long,
    val board: List<SquareResponseDTO>,
    val currentTurn: String,
    val status: String,
    val error: String? = null
)

data class SquareResponseDTO(
    val x: Int,
    val y: Int,
    val squareValue: String?
)
