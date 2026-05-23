package com.leadestate.backend.controller;

import com.leadestate.backend.entity.NotificationSetting;
import com.leadestate.backend.repository.NotificationSettingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notif-settings")
@CrossOrigin("*")
public class NotificationSettingController {

    @Autowired
    private NotificationSettingRepository repo;

    @GetMapping("/{userId}")
    public NotificationSetting getSetting(
            @PathVariable Integer userId
    ){

        return repo.findByUserId(userId)
            .orElseGet(() -> {

                NotificationSetting s =
                        new NotificationSetting();

                s.setUserId(userId);

                s.setFollowupApp(true);
                s.setFollowupWa(true);

                s.setLeadApp(true);
                s.setLeadWa(false);

                s.setStatusApp(true);
                s.setStatusWa(false);

                s.setClosingApp(true);
                s.setClosingWa(true);

                s.setSystemApp(true);
                s.setSystemWa(false);

                return repo.save(s);

            });

    }

    @PutMapping("/{userId}")
    public NotificationSetting saveSetting(
            @PathVariable Integer userId,
            @RequestBody NotificationSetting body
    ){

        NotificationSetting setting =
                repo.findByUserId(userId)
                .orElse(new NotificationSetting());

        setting.setUserId(userId);

        setting.setFollowupApp(
                body.getFollowupApp()
        );

        setting.setFollowupWa(
                body.getFollowupWa()
        );

        setting.setLeadApp(
                body.getLeadApp()
        );

        setting.setLeadWa(
                body.getLeadWa()
        );

        setting.setStatusApp(
                body.getStatusApp()
        );

        setting.setStatusWa(
                body.getStatusWa()
        );

        setting.setClosingApp(
                body.getClosingApp()
        );

        setting.setClosingWa(
                body.getClosingWa()
        );

        setting.setSystemApp(
                body.getSystemApp()
        );

        setting.setSystemWa(
                body.getSystemWa()
        );

        return repo.save(setting);

    }

}