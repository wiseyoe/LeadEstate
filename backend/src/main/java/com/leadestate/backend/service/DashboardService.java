package com.leadestate.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leadestate.backend.dto.DashboardResponse;
import com.leadestate.backend.repository.LeadRepository;
import com.leadestate.backend.repository.FollowUpRepository;
import com.leadestate.backend.repository.ReminderRepository;

@Service
public class DashboardService {

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private FollowUpRepository followUpRepository;

    @Autowired
    private ReminderRepository reminderRepository;

    public DashboardResponse getDashboardData() {

        long totalLeads = leadRepository.count();

        long totalFollowUps = followUpRepository.count();
        long pendingFollowUps = followUpRepository.countByStatus("pending");
        long doneFollowUps = followUpRepository.countByStatus("done");
        long cancelledFollowUps = followUpRepository.countByStatus("cancelled");

        long pendingReminders = reminderRepository.countByStatus("pending");
        long doneReminders = reminderRepository.countByStatus("done");

        return new DashboardResponse(
                totalLeads,
                totalFollowUps,
                pendingFollowUps,
                doneFollowUps,
                cancelledFollowUps,
                pendingReminders,
                doneReminders
        );
    }
}