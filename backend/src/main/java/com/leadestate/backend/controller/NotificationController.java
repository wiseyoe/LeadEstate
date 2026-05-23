package com.leadestate.backend.controller;

import com.leadestate.backend.entity.Notification;
import com.leadestate.backend.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin
public class NotificationController {

    @Autowired
    private NotificationService service;

    @GetMapping("/{userId}")
    public List<Notification> getNotif(
            @PathVariable Integer userId
    ){
        return service.getByUser(
                userId
        );
    }

    @PutMapping("/{id}/read")
    public void readNotif(
            @PathVariable Integer id
    ){
        service.markRead(id);
    }

}