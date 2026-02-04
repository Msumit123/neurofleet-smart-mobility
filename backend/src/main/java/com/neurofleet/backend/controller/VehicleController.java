package com.neurofleet.backend.controller;

import com.neurofleet.backend.model.Vehicle;
import com.neurofleet.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    VehicleRepository vehicleRepository;

    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FLEET_MANAGER')")
    public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @GetMapping("/driver/{driverId}")
    @PreAuthorize("hasAuthority('DRIVER') or hasAuthority('ADMIN')")
    public ResponseEntity<Vehicle> getVehicleByDriver(@PathVariable Long driverId) {
        return vehicleRepository.findByAssignedDriverId(driverId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FLEET_MANAGER')")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicleDetails) {
        return vehicleRepository.findById(id).map(vehicle -> {
            vehicle.setName(vehicleDetails.getName());
            vehicle.setLicensePlate(vehicleDetails.getLicensePlate());
            vehicle.setType(vehicleDetails.getType());
            vehicle.setModel(vehicleDetails.getModel());
            vehicle.setStatus(vehicleDetails.getStatus());
            vehicle.setCapacity(vehicleDetails.getCapacity());
            vehicle.setFuelType(vehicleDetails.getFuelType());
            vehicle.setAssignedDriverId(vehicleDetails.getAssignedDriverId());
            return ResponseEntity.ok(vehicleRepository.save(vehicle));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        return vehicleRepository.findById(id).map(vehicle -> {
            vehicleRepository.delete(vehicle);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
