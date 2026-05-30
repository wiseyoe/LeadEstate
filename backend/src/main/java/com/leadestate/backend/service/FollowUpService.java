package com.leadestate.backend.service;

import com.leadestate.backend.dto.FollowUpRequest;
import com.leadestate.backend.entity.FollowUp;
import com.leadestate.backend.entity.NotificationSetting;
import com.leadestate.backend.entity.Reminder;
import com.leadestate.backend.entity.Lead;

import com.leadestate.backend.repository.LeadRepository;
import com.leadestate.backend.repository.FollowUpRepository;
import com.leadestate.backend.repository.NotificationSettingRepository;
import com.leadestate.backend.repository.ReminderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowUpService {

    @Autowired
    private FollowUpRepository followUpRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationSettingRepository settingRepo;

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private ReminderRepository reminderRepository;

    public List<FollowUp> getByLeadId(Long leadId) {
        return followUpRepository.findByLeadIdOrderByCreatedAtDesc(leadId);
    }

    // FR 8 - Create FollowUp
    public FollowUp createFollowUp(FollowUpRequest request) {

        // ── VALIDASI WAJIB ───────────────────────────────────────────────────
        if (request.getFollowupDate() == null) {
            throw new RuntimeException("Tanggal follow up wajib diisi");
        }

        if (request.getSalesId() == null) {
            throw new RuntimeException("Sales wajib diisi");
        }
        
        if (request.getLeadId() == null) {
            throw new RuntimeException("Lead wajib diisi");
        }

        // ── MAPPING ENTITY ───────────────────────────────────────────────────
        FollowUp followUp = new FollowUp();
        followUp.setLeadId(request.getLeadId());
        followUp.setSalesId(request.getSalesId());
        followUp.setNotes(request.getNotes());
        followUp.setFollowupDate(request.getFollowupDate());

        // Logika Status: menentukan alur proses bisnis (pending / done / cancelled)
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            followUp.setStatus(request.getStatus());
        } else {
            followUp.setStatus("pending");
        }

        if (request.getFollowupDate() == null) {
                throw new RuntimeException("Tanggal follow up wajib diisi");
        }

        // SAVE FOLLOWUP
        FollowUp saved = followUpRepository.save(followUp);

        // ── OTOMATISASI REMINDER ─────────────────────────────────────────────
        Reminder reminder = new Reminder();
        reminder.setFollowUp(saved);
        reminder.setReminderDate(saved.getFollowupDate());
        reminder.setIsSent(false);
        reminderRepository.save(reminder);

        // ── AMBIL DATA LEAD UNTUK NOTIFIKASI ─────────────────────────────────
        Lead lead = leadRepository.findById(request.getLeadId().intValue())
                .orElse(null);

        String leadName = (lead != null) ? lead.getName() : "Unknown Lead";

        // CEK SETTING NOTIFIKASI SALES
        NotificationSetting setting = settingRepo.findByUserId(request.getSalesId().intValue())
                .orElse(null);

        // KIRIM IN-APP NOTIFICATION JIKA AKTIF
        if (setting != null && Boolean.TRUE.equals(setting.getFollowupApp())) {
            notificationService.createNotification(
                    request.getSalesId().intValue(),
                    "Reminder Follow Up",
                    "Lead " + leadName + " masuk ke reminder follow up"
            );
        }

        return saved;
    }
}