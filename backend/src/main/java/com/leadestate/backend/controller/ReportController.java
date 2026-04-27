package com.leadestate.backend.controller;

import com.leadestate.backend.dto.ReportResponse;
import com.leadestate.backend.service.LeadService;
import com.leadestate.backend.service.ReportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/report")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    @Autowired
    private LeadService leadService;

    @Autowired
    private ReportService reportService;

    // 🔹 EXISTING (jangan dihapus)
    @GetMapping
    public ReportResponse getReport() {
        return leadService.getLeadStats();
    }

    // 🔥 BARU
    @GetMapping("/followup-status")
    public Object getFollowUpStatusReport() {
        return reportService.getFollowUpStatusReport();
    }
}