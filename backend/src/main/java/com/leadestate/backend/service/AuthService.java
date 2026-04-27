package com.leadestate.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leadestate.backend.entity.User;
import com.leadestate.backend.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // NOTE: sementara pakai HashMap, seharusnya pakai database + expiry time
    private Map<String, String> resetTokens = new HashMap<>();
    private Map<String, Long> tokenExpiry = new HashMap<>();

    public User login(String email, String password) {

        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Email input: " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("❌ USER TIDAK DITEMUKAN");
                    return new RuntimeException("User tidak ditemukan");
                });

        System.out.println("✅ USER DITEMUKAN: " + user.getEmail());
        // DEBUG ONLY (hapus di production)

        if (!user.getPassword().equals(password)) {
            System.out.println("❌ PASSWORD SALAH");
            throw new RuntimeException("Password salah");
        }

        System.out.println("🎉 LOGIN BERHASIL");

        return user;
    }

    public User register(User user) {
        userRepository.findByEmail(user.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email sudah terdaftar!");
        });

        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // ==========================
    // RESET PASSWORD (UPDATED)
    // ==========================

    public String createResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email tidak ditemukan"));

        String token = UUID.randomUUID().toString();

        resetTokens.put(token, user.getEmail());

        // expired 5 menit
        tokenExpiry.put(token, System.currentTimeMillis() + (5 * 60 * 1000));

        return token;
    }

    public String validateToken(String token) {
        String email = resetTokens.get(token);
        Long expiry = tokenExpiry.get(token);

        if (email == null || expiry == null) {
            throw new RuntimeException("Token tidak valid");
        }

        if (System.currentTimeMillis() > expiry) {
            resetTokens.remove(token);
            tokenExpiry.remove(token);
            throw new RuntimeException("Token expired");
        }

        return email;
    }

    public void resetPassword(String token, String newPassword) {
        String email = validateToken(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        if (user.getPassword().equals(newPassword)) {
            throw new RuntimeException("Gagal update: password baru tidak boleh sama dengan password lama");
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        resetTokens.remove(token);
        tokenExpiry.remove(token);
    }
}