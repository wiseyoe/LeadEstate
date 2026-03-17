package com.leadestate.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "lead_status")
public class LeadStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String statusName;

    public Long getId() { return id; }

    public String getStatusName() { return statusName; }

    public void setStatusName(String statusName) { this.statusName = statusName; }
}