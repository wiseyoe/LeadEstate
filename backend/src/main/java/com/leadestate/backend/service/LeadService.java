package com.leadestate.backend.service;

import com.leadestate.backend.dto.LeadRequest;
import com.leadestate.backend.dto.ReportResponse;
import com.leadestate.backend.entity.Lead;
import com.leadestate.backend.entity.LeadStatus;
import com.leadestate.backend.entity.User;
import com.leadestate.backend.repository.LeadRepository;
import com.leadestate.backend.repository.LeadStatusRepository;
import com.leadestate.backend.repository.FollowUpRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadService {

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private FollowUpRepository followUpRepository;

    @Autowired
    private LeadStatusRepository leadStatusRepository;

    public List<Lead> getLeadsByUser(User user) {
        if (user.isAdmin()) {
            return leadRepository.findAll();
        } else {
            return leadRepository.findBySalesId(user.getId());
        }
    }

    // =========================
    // FR5 - Tambah Lead
    // =========================
    public Lead createLead(LeadRequest request) {
        Lead lead = new Lead();
        lead.setName(request.getName());
        lead.setPhone(request.getPhone());
        lead.setEmail(request.getEmail());
        lead.setPropertyId(request.getPropertyId());
        lead.setSalesId(request.getSalesId());

        LeadStatus status = leadStatusRepository.findById(request.getStatusId())
            .orElseThrow(() -> new RuntimeException("Status tidak ditemukan"));
        lead.setStatus(status);

        lead.setSource(request.getSource());

        return leadRepository.save(lead);
    }

    // =========================
    // FR6 - Get All Leads
    // =========================
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    // =========================
    // FR7 - Update Status Lead
    // =========================
    public Lead updateStatus(int id, int statusId) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead tidak ditemukan"));

        LeadStatus status = leadStatusRepository.findById(statusId)
                .orElseThrow(() -> new RuntimeException("Status tidak ditemukan"));
        lead.changeStatus(status);

        return leadRepository.save(lead);
    }

    // =========================
    // FR - Edit Lead
    // =========================
    public Lead updateLead(int id, LeadRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead tidak ditemukan"));

        lead.setName(request.getName());
        lead.setPhone(request.getPhone());
        lead.setEmail(request.getEmail());
        lead.setPropertyId(request.getPropertyId());
        lead.setSalesId(request.getSalesId());
        lead.setSource(request.getSource());

        // update status
        LeadStatus status = leadStatusRepository.findById(request.getStatusId())
                .orElseThrow(() -> new RuntimeException("Status tidak ditemukan"));

        lead.setStatus(status);

        return leadRepository.save(lead);
    }

    // =========================
    // REPORT - Statistik Lead (GABUNGAN - DENGAN ESTIMATED REVENUE)
    // =========================
    public ReportResponse getLeadStats() {
        long totalLeads     = leadRepository.count();
        long totalFollowUps = followUpRepository.count();
        long closedLeads    = leadRepository.countByStatus_Id(5); // status_id = 5 = Closed
        long activeLeads    = totalLeads - closedLeads;
        
        double estimatedRevenue = leadRepository.sumEstimatedRevenue();

        return new ReportResponse(
                totalLeads,
                totalFollowUps,
                closedLeads,
                activeLeads,
                estimatedRevenue 
        );
    }
}