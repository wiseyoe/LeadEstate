package com.leadestate.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String phone;

    private String email;

    private String source;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;

    @ManyToOne
    @JoinColumn(name = "sales_id")
    private User sales;

    @ManyToOne
    @JoinColumn(name = "status_id")
    private LeadStatus status;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getter Setter

    public Long getId() { return id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }

    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getSource() { return source; }

    public void setSource(String source) { this.source = source; }

    public Property getProperty() { return property; }

    public void setProperty(Property property) { this.property = property; }

    public User getSales() { return sales; }

    public void setSales(User sales) { this.sales = sales; }

    public LeadStatus getStatus() { return status; }

    public void setStatus(LeadStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}