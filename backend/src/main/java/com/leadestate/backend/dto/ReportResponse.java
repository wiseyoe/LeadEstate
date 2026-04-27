package com.leadestate.backend.dto;

public class ReportResponse {

    private long totalLeads;
    private long totalFollowUps;
    private long closedLeads;
    private long activeLeads;

    public ReportResponse(long totalLeads, long totalFollowUps, long closedLeads, long activeLeads) {
        this.totalLeads = totalLeads;
        this.totalFollowUps = totalFollowUps;
        this.closedLeads = closedLeads;
        this.activeLeads = activeLeads;
    }

    public long getTotalLeads() { return totalLeads; }
    public long getTotalFollowUps() { return totalFollowUps; }
    public long getClosedLeads() { return closedLeads; }
    public long getActiveLeads() { return activeLeads; }
}