package com.leadestate.backend.service;

import com.leadestate.backend.dto.FollowUpRequest;
import com.leadestate.backend.entity.FollowUp;
import com.leadestate.backend.repository.FollowUpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FollowUpService {

    @Autowired
    private FollowUpRepository followUpRepository;

    // FR 8 - Create FollowUp
    public FollowUp createFollowUp(FollowUpRequest request) {
        FollowUp followUp = new FollowUp();
        followUp.setLeadId(request.getLeadId());
        followUp.setSalesId(request.getSalesId());
        followUp.setNotes(request.getNotes());
        followUp.setFollowupDate(request.getFollowupDate());

        if (request.getStatus() != null) {
            followUp.setStatus(request.getStatus());
        }

        return followUpRepository.save(followUp);
    }
}
