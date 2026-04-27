package com.leadestate.backend.dto;

public class ChartResponse {

    private String label;
    private long value;

    public ChartResponse(String label, long value) {
        this.label = label;
        this.value = value;
    }

    public String getLabel() { return label; }
    public long getValue() { return value; }
}