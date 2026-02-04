package com.neurofleet.backend.repository;

import com.neurofleet.backend.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByDriverId(Long driverId);
    List<Trip> findByCustomerId(Long customerId);
    Optional<Trip> findByDriverIdAndStatus(Long driverId, String status);
}
