package com.leadestate.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "followup_id", nullable = false)
    private Long followupId;

    @Column(name = "reminder_date")
    private LocalDateTime reminderDate;

    @Column(name = "status")
    private String status = "pending";

    // ===== Getter & Setter =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFollowupId() { return followupId; }
    public void setFollowupId(Long followupId) { this.followupId = followupId; }

    public LocalDateTime getReminderDate() { return reminderDate; }
    public void setReminderDate(LocalDateTime reminderDate) { this.reminderDate = reminderDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}