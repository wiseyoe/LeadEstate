package com.leadestate.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "notification_settings")
@Data
public class NotificationSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(
        name="user_id",
        unique=true
    )
    private Integer userId;

    @Column(name = "followup_app")
    private Boolean followupApp;

    @Column(name = "followup_wa")
    private Boolean followupWa;

    @Column(name = "lead_app")
    private Boolean leadApp;

    @Column(name = "lead_wa")
    private Boolean leadWa;

    @Column(name = "status_app")
    private Boolean statusApp;

    @Column(name = "status_wa")
    private Boolean statusWa;

    @Column(name = "closing_app")
    private Boolean closingApp;

    @Column(name = "closing_wa")
    private Boolean closingWa;

    @Column(name = "system_app")
    private Boolean systemApp;

    @Column(name = "system_wa")
    private Boolean systemWa;
}