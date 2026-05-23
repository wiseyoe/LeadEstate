package com.leadestate.backend.repository;

import com.leadestate.backend.entity.NotificationSetting;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationSettingRepository
extends JpaRepository<NotificationSetting,Integer> {

    Optional<NotificationSetting>
    findByUserId(Integer userId);

}