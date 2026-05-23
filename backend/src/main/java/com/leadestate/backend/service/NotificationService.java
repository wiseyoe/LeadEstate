package com.leadestate.backend.service;

import com.leadestate.backend.entity.Notification;
import com.leadestate.backend.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repo;

    public void createNotification(
            Integer userId,
            String title,
            String message
    ){

        Notification notif =
                new Notification();
        notif.setUserId(
                userId
        );
        notif.setTitle(
                title
        );
        notif.setMessage(
                message
        );
        repo.save(
                notif
        );
    }
}