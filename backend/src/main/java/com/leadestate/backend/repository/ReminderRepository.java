package com.leadestate.backend.repository;

import com.leadestate.backend.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    long countByStatus(String status);

    @Query(value = """
        SELECT 
        l.name,
        p.name,
        fu.followup_date,
        r.status
        FROM reminders r
        JOIN follow_ups fu ON r.followup_id = fu.id
        JOIN leads l ON fu.lead_id = l.id
        JOIN properties p ON l.property_id = p.id
        ORDER BY fu.followup_date ASC
    """, nativeQuery = true)
    List<Object[]> getTodayReminders();
}