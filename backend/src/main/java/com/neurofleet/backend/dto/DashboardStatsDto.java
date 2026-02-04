package com.neurofleet.backend.dto;

public class DashboardStatsDto {
    private long totalVehicles;
    private long activeVehicles;
    private long totalDrivers;
    private long activeDrivers;
    private long pendingApprovals;
    private long vehiclesNeedingService;

    // Getters and Setters
    public long getTotalVehicles() { return totalVehicles; }
    public void setTotalVehicles(long totalVehicles) { this.totalVehicles = totalVehicles; }

    public long getActiveVehicles() { return activeVehicles; }
    public void setActiveVehicles(long activeVehicles) { this.activeVehicles = activeVehicles; }

    public long getTotalDrivers() { return totalDrivers; }
    public void setTotalDrivers(long totalDrivers) { this.totalDrivers = totalDrivers; }

    public long getActiveDrivers() { return activeDrivers; }
    public void setActiveDrivers(long activeDrivers) { this.activeDrivers = activeDrivers; }

    public long getPendingApprovals() { return pendingApprovals; }
    public void setPendingApprovals(long pendingApprovals) { this.pendingApprovals = pendingApprovals; }

    public long getVehiclesNeedingService() { return vehiclesNeedingService; }
    public void setVehiclesNeedingService(long vehiclesNeedingService) { this.vehiclesNeedingService = vehiclesNeedingService; }
}
