package com.volskwagenTTBackend.VolskwagenTTBackend.repository

import com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity.SquareEntity
import org.springframework.data.jpa.repository.JpaRepository


interface SquareRepository: JpaRepository<SquareEntity, Long> {
}