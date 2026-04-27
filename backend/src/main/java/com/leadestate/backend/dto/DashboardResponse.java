package com.leadestate.backend.dto;

public class DashboardResponse {

    private long totalLeads;
    private long totalFollowUps;

    private long pendingFollowUps;
    private long doneFollowUps;
    private long cancelledFollowUps;

    private long pendingReminders;
    private long doneReminders;

    public DashboardResponse(long totalLeads, long totalFollowUps,
                             long pendingFollowUps, long doneFollowUps, long cancelledFollowUps,
                             long pendingReminders, long doneReminders) {

        this.totalLeads = totalLeads;
        this.totalFollowUps = totalFollowUps;
        this.pendingFollowUps = pendingFollowUps;
        this.doneFollowUps = doneFollowUps;
        this.cancelledFollowUps = cancelledFollowUps;
        this.pendingReminders = pendingReminders;
        this.doneReminders = doneReminders;
    }

    public long getTotalLeads() { return totalLeads; }
    public long getTotalFollowUps() { return totalFollowUps; }

    public long getPendingFollowUps() { return pendingFollowUps; }
    public long getDoneFollowUps() { return doneFollowUps; }
    public long getCancelledFollowUps() { return cancelledFollowUps; }

    public long getPendingReminders() { return pendingReminders; }
    public long getDoneReminders() { return doneReminders; }
}