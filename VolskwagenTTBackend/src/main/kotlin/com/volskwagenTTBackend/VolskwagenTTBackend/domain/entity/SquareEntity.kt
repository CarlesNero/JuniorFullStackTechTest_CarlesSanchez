package com.volskwagenTTBackend.VolskwagenTTBackend.domain.entity

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*

@Entity
@Table(name = "square")
data class SquareEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    var x: Int,

    @Column(nullable = false)
    var y: Int,

    @Column(nullable = true)
    var square_value : String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match")
    @JsonBackReference
    var match: MatchEntity? = null

)
