package com.leadestate.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.leadestate.backend.dto.ChartResponse;
import com.leadestate.backend.service.DashboardService;

// Import tambahan agar List dan Map terbaca
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    // Endpoint lama untuk ringkasan angka dashboard
    @GetMapping
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }

    /**
     * Implementasi Endpoint Baru untuk Chart
     * URL: GET http://localhost:8080/api/dashboard/leads-by-status
     */
    @GetMapping("/leads-by-status")
    public List<ChartResponse> getLeadsByStatus() {
        return dashboardService.getLeadsByStatus();
    }

    @GetMapping("/sales-performance")
    public List<ChartResponse> getSalesPerformance() {
        return dashboardService.getSalesPerformance();
    }
}