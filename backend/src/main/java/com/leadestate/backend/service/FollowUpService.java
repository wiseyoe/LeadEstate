package com.leadestate.backend.service;

import com.leadestate.backend.dto.FollowUpRequest;
import com.leadestate.backend.entity.FollowUp;
import com.leadestate.backend.entity.NotificationSetting;

import com.leadestate.backend.repository.FollowUpRepository;
import com.leadestate.backend.repository.NotificationSettingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class FollowUpService {

    @Autowired
    private FollowUpRepository followUpRepository;

    @Autowired
    private NotificationService
            notificationService;

    @Autowired
    private NotificationSettingRepository
            settingRepo;

    // FR 8 - Create FollowUp
    public FollowUp createFollowUp(
            FollowUpRequest request
    ) {

        FollowUp followUp =
                new FollowUp();

        followUp.setLeadId(
                request.getLeadId()
        );

        followUp.setSalesId(
                request.getSalesId()
        );

        followUp.setNotes(
                request.getNotes()
        );

        followUp.setFollowupDate(
                request.getFollowupDate()
        );

        if(
            request.getStatus()
            != null
        ){

            followUp.setStatus(
                    request.getStatus()
            );

        }

        // SAVE FOLLOWUP
        FollowUp saved =
                followUpRepository
                .save(followUp);

        // CEK SETTING NOTIF
        NotificationSetting setting =
                settingRepo.findByUserId(
                    request.getSalesId().intValue()
                )
                .orElse(null);

        // KIRIM IN APP NOTIF
        if(

            setting != null &&

            Boolean.TRUE.equals(
                setting.getFollowupApp()
            )

        ){

            notificationService.createNotification(

                    request.getSalesId().intValue(),
                    "Reminder Follow Up",
                    "Follow up baru berhasil dibuat"

            );

        }

        return saved;
    }
}