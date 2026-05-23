package com.leadestate.backend.repository;

import com.leadestate.backend.entity.Notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
extends JpaRepository<
Notification,
Integer>{

    List<Notification>
    findByUserIdOrderByCreatedAtDesc(
            Integer userId
    );

    boolean existsByUserIdAndTitleAndMessage(
            Integer userId,
            String title,
            String message
    );

}