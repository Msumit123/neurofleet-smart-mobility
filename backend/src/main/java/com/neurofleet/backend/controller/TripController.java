package com.neurofleet.backend.controller;

import com.neurofleet.backend.model.Trip;
import com.neurofleet.backend.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/trips")
public class TripController {

    @Autowired
    TripRepository tripRepository;

    @PostMapping
    public Trip createTrip(@RequestBody Trip trip) {
        trip.setStatus("PENDING");
        trip.setStartTime(LocalDateTime.now());
        return tripRepository.save(trip);
    }

    @GetMapping("/driver/{driverId}/active")
    public ResponseEntity<Trip> getActiveTripForDriver(@PathVariable Long driverId) {
        // Assuming active means PENDING or IN_PROGRESS
        return tripRepository.findByDriverIdAndStatus(driverId, "IN_PROGRESS")
                .or(() -> tripRepository.findByDriverIdAndStatus(driverId, "PENDING"))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/customer/{customerId}")
    public List<Trip> getCustomerTrips(@PathVariable Long customerId) {
        return tripRepository.findByCustomerId(customerId);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Trip> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return tripRepository.findById(id).map(trip -> {
            trip.setStatus(status);
            if ("COMPLETED".equals(status)) {
                trip.setEndTime(LocalDateTime.now());
            }
            return ResponseEntity.ok(tripRepository.save(trip));
        }).orElse(ResponseEntity.notFound().build());
    }
}
