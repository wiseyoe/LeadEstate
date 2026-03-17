package com.leadestate.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime reminderDate;

    private String status;

    @ManyToOne
    @JoinColumn(name = "followup_id")
    private FollowUp followUp;

    // Getter Setter

    public Long getId() { return id; }

    public LocalDateTime getReminderDate() { return reminderDate; }

    public void setReminderDate(LocalDateTime reminderDate) {
        this.reminderDate = reminderDate;
    }

    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }

    public FollowUp getFollowUp() { return followUp; }

    public void setFollowUp(FollowUp followUp) {
        this.followUp = followUp;
    }
}