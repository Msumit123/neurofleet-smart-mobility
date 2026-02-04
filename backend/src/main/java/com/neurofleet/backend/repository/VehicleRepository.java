package com.neurofleet.backend.repository;

import com.neurofleet.backend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByAssignedDriverId(Long assignedDriverId);
}    long countByStatus(String status);
}
