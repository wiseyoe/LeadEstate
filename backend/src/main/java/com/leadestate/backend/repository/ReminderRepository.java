package com.leadestate.backend.repository;

import com.leadestate.backend.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    long countByStatus(String status);
}