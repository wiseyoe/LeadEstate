package com.leadestate.backend.controller;

import com.leadestate.backend.dto.LeadRequest;
import com.leadestate.backend.entity.Lead;
import com.leadestate.backend.repository.LeadRepository;
import com.leadestate.backend.service.LeadService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "http://localhost:5173")
public class LeadController {

    // ===== dari no.1 =====
    @Autowired
    private LeadRepository leadRepository;

    // ===== dari no.2 =====
    @Autowired
    private LeadService leadService;

    // =========================
    // FR5 - Tambah Lead
    // =========================
    @PostMapping
    public Lead createLead(@RequestBody LeadRequest request) {
        return leadService.createLead(request);
    }

    // =========================
    // FR6 - Get All Leads (SERVICE)
    // =========================
    @GetMapping
    public List<Lead> getAllLeads() {
        return leadService.getAllLeads();
    }

    // =========================
    // FR6 versi RAW (dari no.1)
    // =========================
    @GetMapping("/raw")
    public List<Lead> getAllLeadsRaw() {
        return leadRepository.findAll();
    }

    // =========================
    // FR7 - Update Status
    // =========================
    @PutMapping("/{id}/status")
    public Lead updateStatus(
            @PathVariable int id,
            @RequestParam int statusId) {
        return leadService.updateStatus(id, statusId);
    }
}