package com.leadestate.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.leadestate.backend.service.DashboardService;

// Import tambahan agar List dan Map terbaca
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
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
    public List<Map<String, Object>> getLeadsByStatus() {
        return dashboardService.getLeadsByStatus();
    }
}