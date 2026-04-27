package com.leadestate.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leadestate.backend.repository.FollowUpRepository;
import com.leadestate.backend.dto.ChartResponse;

import java.util.*;

@Service
public class ReportService {

    @Autowired
    private FollowUpRepository followUpRepository;

    public List<ChartResponse> getFollowUpStatusReport() {

        List<Object[]> results = followUpRepository.countFollowUpGroupByStatus();

        List<ChartResponse> response = new ArrayList<>();

        for (Object[] row : results) {
            String status = (String) row[0];
            long count = (long) row[1];

            response.add(new ChartResponse(status, count));
        }

        return response;
    }
}