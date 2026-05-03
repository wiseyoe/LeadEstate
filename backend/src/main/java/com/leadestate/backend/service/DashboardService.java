package com.leadestate.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leadestate.backend.dto.DashboardResponse;
import com.leadestate.backend.repository.LeadRepository;
import com.leadestate.backend.repository.FollowUpRepository;
import com.leadestate.backend.repository.ReminderRepository;

// Import tambahan untuk List dan Map
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    /**
     * Implementasi STEP 2: Mengambil statistik Leads berdasarkan Status
     */
    public List<Map<String, Object>> getLeadsByStatus() {
        // Memanggil query kustom dari LeadRepository
        List<Object[]> results = leadRepository.countLeadsByStatus();

        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> data = new HashMap<>();
            // row[0] adalah statusId, row[1] adalah jumlah (COUNT)
            data.put("statusId", row[0]);
            data.put("status", row[1]);
            data.put("total", row[2]);
            response.add(data);
        }

        return response;
    }
}