package com.leadestate.backend.controller;

import com.leadestate.backend.entity.Reminder;
import com.leadestate.backend.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reminders")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    // FR 9 - GET /reminders
    @GetMapping
    public ResponseEntity<?> getAllReminders() {
        try {
            List<Reminder> reminders = reminderService.getAllReminders();

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Daftar reminder berhasil diambil");
            response.put("data", reminders);

            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Gagal mengambil reminder");
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
