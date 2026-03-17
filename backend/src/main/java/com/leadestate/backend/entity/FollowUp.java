package com.leadestate.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "follow_ups")
public class FollowUp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String notes;

    private LocalDateTime followupDate;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @ManyToOne
    @JoinColumn(name = "sales_id")
    private User sales;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getter Setter

    public Long getId() { return id; }

    public String getNotes() { return notes; }

    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getFollowupDate() { return followupDate; }

    public void setFollowupDate(LocalDateTime followupDate) {
        this.followupDate = followupDate;
    }

    public Lead getLead() { return lead; }

    public void setLead(Lead lead) { this.lead = lead; }

    public User getSales() { return sales; }

    public void setSales(User sales) { this.sales = sales; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}