package com.leadestate.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name="notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue(
        strategy=
        GenerationType.IDENTITY
    )
    private Integer id;

    @Column(name="user_id")
    private Integer userId;

    private String title;

    private String message;

    private Boolean isRead=false;

    private LocalDateTime createdAt=
        LocalDateTime.now();

}