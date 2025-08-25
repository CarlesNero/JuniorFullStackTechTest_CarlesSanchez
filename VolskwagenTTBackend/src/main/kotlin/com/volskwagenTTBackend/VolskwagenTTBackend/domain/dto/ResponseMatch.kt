package com.volskwagenTTBackend.VolskwagenTTBackend.domain.dto

import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.SquareEntity


data class ResponseMatch(

    val id: Long?,

    val player: ResponsePlayer,

    val squares: MutableList<SquareEntity> = mutableListOf(),

    val currentTurn: String,

    val status: String

)