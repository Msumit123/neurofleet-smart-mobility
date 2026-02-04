package com.neurofleet.backend.controller;

import com.neurofleet.backend.dto.DashboardStatsDto;
import com.neurofleet.backend.model.User;
import com.neurofleet.backend.repository.UserRepository;
import com.neurofleet.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    VehicleRepository vehicleRepository;

    @GetMapping("/stats")
    public DashboardStatsDto getStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalVehicles(vehicleRepository.count());
        stats.setActiveVehicles(vehicleRepository.countByStatus("IN_USE"));
        stats.setVehiclesNeedingService(vehicleRepository.countByStatus("NEEDS_SERVICE"));

        // Count drivers from users table
        long totalDrivers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.DRIVER)
                .count();
        stats.setTotalDrivers(totalDrivers);

        long pendingApprovals = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.DRIVER && u.getApprovalStatus() == User.ApprovalStatus.PENDING)
                .count();
        stats.setPendingApprovals(pendingApprovals);

        // For now, assuming active drivers = active vehicles (simplification)
        stats.setActiveDrivers(stats.getActiveVehicles());

        return stats;
    }
}
