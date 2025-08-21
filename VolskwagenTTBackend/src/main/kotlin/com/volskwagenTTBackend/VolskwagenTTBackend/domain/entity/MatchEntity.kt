package com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table

@Entity
@Table(name = "match")
data class MatchEntity(


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne
    @JsonManagedReference
    var player: PlayerEntity,

    @OneToMany(mappedBy = "match", cascade = [CascadeType.ALL], orphanRemoval = true)
    @JsonManagedReference
    var squares: MutableList<SquareEntity> = mutableListOf(),

    @Column(nullable = false)
    var currentTurn: String = "X",

    @Column(nullable = false)
    var status: String = "IN_PROGRESS"


    )




