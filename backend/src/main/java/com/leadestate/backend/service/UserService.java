package com.leadestate.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leadestate.backend.entity.User;
import com.leadestate.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // GET ALL USERS
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // CREATE USER
    public User createUser(User user){
        if(userRepository.existsByEmail(user.getEmail())){
            throw new RuntimeException("Email sudah terdaftar");
        }

        user.setRoleId(3);
        return userRepository.save(user);
    }

    // UPDATE USER
    public User updateUser(Integer id, User user) {
        User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        existingUser.setRoleId(user.getRoleId());

        return userRepository.save(existingUser);
    }

    // DELETE USER
    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        userRepository.delete(user);
    }
}