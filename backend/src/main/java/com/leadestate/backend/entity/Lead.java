package com.leadestate.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Data
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String phone;
    private String email;

    @Column(name = "property_id")
    private int propertyId;

    @Column(name = "sales_id")
    private int salesId;

    @ManyToOne
    @JoinColumn(name = "status_id")
    private LeadStatus status;

    private String source;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // =============================
    // METHOD SESUAI SEQUENCE DIAGRAM
    // =============================

    public void changeStatus(LeadStatus newStatus) {
        this.status = newStatus;
    }

    public void assignToSales(int newSalesId) {
        this.salesId = newSalesId;
    }
}