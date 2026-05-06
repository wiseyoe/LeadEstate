package com.leadestate.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leadestate.backend.dto.DashboardResponse;
import com.leadestate.backend.dto.ChartResponse;
import com.leadestate.backend.repository.LeadRepository;
import com.leadestate.backend.repository.FollowUpRepository;
import com.leadestate.backend.repository.ReminderRepository;

// Import tambahan untuk List dan Map
import java.util.ArrayList;
import java.util.List;

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

        long closedLeads = leadRepository.countByStatus_Id(5); // status 5 = Closed
        long activeLeads = totalLeads - closedLeads;

        return new DashboardResponse(
            totalLeads,
            totalFollowUps,
            pendingFollowUps,
            doneFollowUps,
            cancelledFollowUps,
            pendingReminders,
            doneReminders,
            closedLeads,
            activeLeads
        );
    }

    /**
     * Implementasi STEP 2: Mengambil statistik Leads berdasarkan Status
     */
    public List<ChartResponse> getLeadsByStatus() {
        List<Object[]> results = leadRepository.countLeadsByStatus();
        List<ChartResponse> response = new ArrayList<>();

        for (Object[] row : results) {
            String statusName = (String) row[1];
            long total = ((Number) row[2]).longValue(); 

            response.add(new ChartResponse(statusName, total));
        }

        return response;
    }

    public List<ChartResponse> getLeadsPerMonth() {
        List<Object[]> results = leadRepository.countLeadsPerMonth();

        List<ChartResponse> response = new ArrayList<>();

        for (Object[] row : results) {
            int month = ((Number) row[0]).intValue();
            long total = ((Number) row[1]).longValue();

            response.add(new ChartResponse(String.valueOf(month), total));
        }

        return response;
    }

    public List<ChartResponse> getSalesPerformance() {
        List<Object[]> results = leadRepository.countLeadsBySales();

        List<ChartResponse> response = new ArrayList<>();

        for (Object[] row : results) {
            Integer salesId = (Integer) row[0];
            long total = ((Number) row[1]).longValue();

            response.add(new ChartResponse("Sales " + salesId, total));
        }

        return response;
    }
}