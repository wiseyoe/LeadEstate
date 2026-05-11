package com.leadestate.backend.controller;

import com.leadestate.backend.dto.ReportResponse;
import com.leadestate.backend.service.LeadService;
import com.leadestate.backend.service.ReportService;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/report")
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

    @GetMapping("/lead-status")
    public Object getLeadStatusReport() {
        return reportService.getLeadStatusReport();
    }


    // Lead per Month
    @GetMapping("/lead-per-month")
    public Object getLeadPerMonthReport() {
        return reportService.getLeadPerMonthReport();
    }

    // Performance per Sales
    @GetMapping("/sales-performance")
    public Object getSalesPerformanceReport() {
        return reportService.getSalesPerformanceReport();
    }

    // Sumber Lead
    @GetMapping("/lead-source")
    public Object getLeadSourceReport() {
        return reportService.getLeadSourceReport();
    }

    // FilterLeads
    @GetMapping("/leads")
    public Object filterLeads(
        @RequestParam(required = false) Integer salesId,
        @RequestParam(required = false) Integer propertyId,
        @RequestParam(required = false) String start,
        @RequestParam(required = false) String end
    ) {

        LocalDateTime startDate = start != null ? LocalDateTime.parse(start + "T00:00:00") : null;
        LocalDateTime endDate = end != null ? LocalDateTime.parse(end + "T23:59:59") : null;

        return reportService.filterLeads(salesId, propertyId, startDate, endDate);
    }
}