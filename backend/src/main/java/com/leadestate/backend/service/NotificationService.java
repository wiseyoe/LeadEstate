package com.leadestate.backend.service;

import com.leadestate.backend.entity.Notification;
import com.leadestate.backend.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repo;

    public void createNotification(
            Integer userId,
            String title,
            String message
    ){

        boolean exists =
                repo.existsByUserIdAndTitleAndMessage(
                        userId,
                        title,
                        message
                );

        // CEGAH DUPLIKAT
        if(exists){
            return;
        }

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

    public List<Notification> getByUser(
            Integer userId
    ){

        return repo
                .findByUserIdOrderByCreatedAtDesc(
                        userId
                );
    }

    public void markRead(
            Integer id
    ){

        Notification notif =
                repo.findById(id)
                .orElseThrow();

        notif.setIsRead(
                true
        );

        repo.save(
                notif
        );
    }
}