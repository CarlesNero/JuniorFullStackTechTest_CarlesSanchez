package com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table

@Entity
@Table(name = "player")
data class PlayerEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(unique = true)
    var username: String,

    @Column(unique = true)
    var email: String,

    @Column(nullable = false)
    var password: String,

    @OneToMany(mappedBy = "player", cascade = [CascadeType.ALL], orphanRemoval = true)
    @JsonBackReference
    var matches : MutableList<MatchEntity> = mutableListOf(),


    )
