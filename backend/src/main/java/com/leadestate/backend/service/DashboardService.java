package com.leadestate.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leadestate.backend.dto.DashboardResponse;
import com.leadestate.backend.dto.ChartResponse;
import com.leadestate.backend.dto.TopSalesResponse; // Pastikan ini ada
import com.leadestate.backend.dto.ReminderResponse; // Pastikan ini ada
import com.leadestate.backend.repository.LeadRepository;
import com.leadestate.backend.repository.FollowUpRepository;
import com.leadestate.backend.repository.ReminderRepository;

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
        // 1. Hitung data statistik utama dari Database
        long totalLeads = leadRepository.count();

        long totalFollowUps = followUpRepository.count();
        long pendingFollowUps = followUpRepository.countByStatus("pending");
        long doneFollowUps = followUpRepository.countByStatus("done");
        long cancelledFollowUps = followUpRepository.countByStatus("cancelled");

        long pendingReminders = reminderRepository.countByStatus("pending");
        long doneReminders = reminderRepository.countByStatus("done");

        long closedLeads = leadRepository.countByStatus_Id(5); // status 5 = Closed
        long activeLeads = totalLeads - closedLeads;

        // 2. Inisialisasi DashboardResponse menggunakan Constructor
        // Karena kita sudah mengupdate DashboardResponse, kita kirimkan null dulu untuk List-nya
        DashboardResponse response = new DashboardResponse(
            totalLeads,
            totalFollowUps,
            pendingFollowUps,
            doneFollowUps,
            cancelledFollowUps,
            pendingReminders,
            doneReminders,
            closedLeads,
            activeLeads,
            null, // chartData
            null, // topSales
            null  // reminders
        );

        // 3. HARDCODE DATA (Sesuai Instruksi agar Frontend hidup)
        
        // Chart Data (Bulan, Leads, Closing)
        response.setChartData(List.of(
            new ChartResponse("Jan", 12, 3),
            new ChartResponse("Feb", 18, 5),
            new ChartResponse("Mar", 25, 8),
            new ChartResponse("Apr", 20, 6),
            new ChartResponse("Mei", 30, 10),
            new ChartResponse("Jun", 40, 15)
        ));

        // Top Sales Data
        response.setTopSales(List.of(
            new TopSalesResponse("Budi Wicaksono", "BW", 20, 5, "#f59e0b"),
            new TopSalesResponse("Sari Rahayu", "SR", 18, 4, "#6366f1"),
            new TopSalesResponse("Kevin Ukinami", "KU", 15, 3, "#10b981")
        ));

        // Reminders Data
        response.setReminders(List.of(
            new ReminderResponse(
                "Rafi Kennedy",
                "RK",
                "🏠 Rumah Bekasi",
                "H+1",
                "10:30",
                "today",
                "#f59e0b"
            ),
            new ReminderResponse(
                "Kevin Ukinami",
                "KU",
                "🏢 Apartemen Bandung",
                "H+3",
                "13:00",
                "soon",
                "#10b981"
            )
        ));

        return response;
    }

    /**
     * Implementasi STEP 2: Mengambil statistik Leads berdasarkan Status (Real Data)
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