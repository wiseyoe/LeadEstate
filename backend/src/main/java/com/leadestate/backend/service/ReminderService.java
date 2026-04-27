package com.leadestate.backend.service;

import com.leadestate.backend.entity.Reminder;
import com.leadestate.backend.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    // FR 9 - Get All Reminders
    public List<Reminder> getAllReminders() {
        return reminderRepository.findAll();
    }
}
