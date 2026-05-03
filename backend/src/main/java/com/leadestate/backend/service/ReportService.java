package com.leadestate.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leadestate.backend.repository.FollowUpRepository;
import com.leadestate.backend.repository.LeadRepository;
import com.leadestate.backend.dto.ChartResponse;

import java.util.*;

@Service
public class ReportService {

    @Autowired
    private FollowUpRepository followUpRepository;

    @Autowired
    private LeadRepository leadRepository;

    /**
     * Mengambil laporan jumlah follow-up berdasarkan status
     */
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

    /**
     * Mengambil laporan jumlah lead berdasarkan status
     */
    public List<ChartResponse> getLeadStatusReport() {
        List<Object[]> results = leadRepository.countLeadsByStatus();
        List<ChartResponse> response = new ArrayList<>();

        for (Object[] row : results) {
            String statusName = (String) row[1];
            long count = (long) row[2];

            response.add(new ChartResponse(statusName, count));
        }

        return response;
    }

    // Lead per Month
    public List<ChartResponse> getLeadPerMonthReport() {

        List<Object[]> results = leadRepository.countLeadsPerMonth();
        List<ChartResponse> response = new ArrayList<>();

        String[] months = {"Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"};

        for (Object[] row : results) {
            int monthIndex = ((Number) row[0]).intValue();
            long count = (long) row[1];

            response.add(new ChartResponse(months[monthIndex - 1], count));
        }

        return response;
    }

    // Performance per Sales
    public List<ChartResponse> getSalesPerformanceReport() {

        List<Object[]> results = leadRepository.countLeadsBySales();
        List<ChartResponse> response = new ArrayList<>();

        for (Object[] row : results) {
            int salesId = (int) row[0];
            long count = (long) row[1];

            response.add(new ChartResponse("Sales " + salesId, count));
        }

        return response;
    }
}