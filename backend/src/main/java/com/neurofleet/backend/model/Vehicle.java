package com.neurofleet.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String licensePlate;

    private String type; // CAR, BIKE, etc.
    private String model;
    private String status; // AVAILABLE, IN_USE, etc.
    private Integer capacity;
    private String fuelType;

    private LocalDateTime lastServiceDate;
    private LocalDateTime nextServiceDue;

    private Long assignedDriverId;

    @PrePersist
    protected void onCreate() {
        // defaults
        if (status == null) status = "AVAILABLE";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public LocalDateTime getLastServiceDate() { return lastServiceDate; }
    public void setLastServiceDate(LocalDateTime lastServiceDate) { this.lastServiceDate = lastServiceDate; }

    public LocalDateTime getNextServiceDue() { return nextServiceDue; }
    public void setNextServiceDue(LocalDateTime nextServiceDue) { this.nextServiceDue = nextServiceDue; }

    public Long getAssignedDriverId() { return assignedDriverId; }
    public void setAssignedDriverId(Long assignedDriverId) { this.assignedDriverId = assignedDriverId; }
}
