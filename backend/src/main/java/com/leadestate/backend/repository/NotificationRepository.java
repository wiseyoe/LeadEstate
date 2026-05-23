package com.leadestate.backend.repository;

import com.leadestate.backend.entity.Notification;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository
extends JpaRepository<
Notification,
Integer>{

}