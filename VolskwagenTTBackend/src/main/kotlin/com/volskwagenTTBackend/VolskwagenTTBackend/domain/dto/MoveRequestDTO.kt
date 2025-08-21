package com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto

data class MoveRequestDTO(

    val matchId : Long,
    val playerId: String,
    val square : SquareDTO
)


data class SquareDTO(
    val x: Int,
    val y: Int
)