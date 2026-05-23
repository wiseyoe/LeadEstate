package com.leadestate.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.leadestate.backend.entity.User;
import com.leadestate.backend.service.UserService;
import com.leadestate.backend.service.AuthService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    // =========================
    // GET ALL USERS (Admin Only)
    // =========================
    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestHeader("Role") String role
    ) {
        try {
            authService.checkAdmin(role);
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (RuntimeException e) {
            return handleUserException(e);
        }
    }

    // =========================
    // CREATE USER (FR10) (Admin Only)
    // =========================
    @PostMapping
    public ResponseEntity<?> addUser(
            @RequestHeader("Role") String role,
            @RequestBody User user
    ) {
        try {
            authService.checkAdmin(role);
            User newUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (RuntimeException e) {
            return handleUserException(e);
        }
    }

    // =========================
    // UPDATE USER (ADMIN) (Admin Only)
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @RequestHeader("Role") String role,
            @PathVariable Integer id,
            @RequestBody User user) {
        try {
            authService.checkAdmin(role);
            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return handleUserException(e);
        }
    }

    // =========================
    // UPDATE ROLE ONLY
    // =========================
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateRole(
            @RequestHeader("Role") String role,
            @PathVariable Integer id,
            @RequestBody User user
    ) {
        try {

            authService.checkAdmin(role);

            User updatedUser =
                userService.updateUserRole(
                    id,
                    user.getRoleId()
                );

            return ResponseEntity.ok(updatedUser);

        } catch (RuntimeException e) {
            return handleUserException(e);
        }
    }

    // =========================
    // DELETE USER (FR11) (Admin Only)
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @RequestHeader("Role") String role,
            @PathVariable Integer id
    ) {
        try {
            authService.checkAdmin(role);
            String message = userService.deleteUser(id);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return handleUserException(e);
        }
    }

    // =========================
    // UPDATE PROFILE (FR12) 
    // =========================
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Integer id,
            @RequestBody User user) {
        try {
            User updatedUser = userService.updateProfile(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            // Karena tidak ada checkAdmin, langsung lempar BAD_REQUEST (atau NOT_FOUND)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(e.getMessage());
        }
    }

    /**
     * Helper method untuk menangani pengecekan pesan error Access Denied
     */
    private ResponseEntity<?> handleUserException(RuntimeException e) {
        if (e.getMessage() != null && e.getMessage().contains("Access denied")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                 .body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                             .body(e.getMessage());
    }
}