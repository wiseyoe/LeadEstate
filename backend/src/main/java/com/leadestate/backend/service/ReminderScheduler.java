package com.leadestate.backend.service;

import com.leadestate.backend.repository.ReminderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReminderScheduler {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private NotificationService notificationService;

    @Scheduled(fixedRate = 60000)
    public void checkReminders() {

        List<Object[]> reminders =
                reminderRepository
                .getPendingReminderNotifications();

        for (Object[] r : reminders) {

            Long reminderId =
                    ((Number) r[0]).longValue();

            Integer userId =
                    ((Number) r[1]).intValue();

            String leadName =
                    (String) r[2];

            notificationService
                    .createNotification(
                            userId,
                            "Reminder Follow Up",
                            "Jangan lupa follow up lead: "
                                    + leadName
                    );

            // ✅ tandai sudah dikirim
            reminderRepository.markAsSent(reminderId);
        }
    }
}