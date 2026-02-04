package com.neurofleet.backend.config;

import com.neurofleet.backend.model.User;
import com.neurofleet.backend.repository.UserRepository;
import com.neurofleet.backend.model.Vehicle;
import com.neurofleet.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    VehicleRepository vehicleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // ... (Existing user init code) ...
        
        // Initialize Demo Vehicles if empty
        if (vehicleRepository.count() == 0) {
            createVehicle("Swift Dzire #001", "KA-01-AB-1234", "CAR", "AVAILABLE");
            createVehicle("Innova Crysta #002", "KA-01-CD-5678", "VAN", "IN_USE");
            createVehicle("Ather 450X #003", "KA-01-EF-9012", "BIKE", "AVAILABLE");
            createVehicle("Bajaj RE #004", "KA-01-GH-3456", "AUTO", "NEEDS_SERVICE");
        }

        // Admin
        if (!userRepository.existsByEmail("admin@neurofleetx.com")) {
            User user = new User();
            user.setEmail("admin@neurofleetx.com");
            user.setPassword(encoder.encode("admin123"));
            user.setName("Alex Administrator");
            user.setRole(User.Role.ADMIN);
            user.setPhone("+1 555-0100");
            user.setApprovalStatus(User.ApprovalStatus.APPROVED);
            userRepository.save(user);
        }

        // Fleet Manager
        if (!userRepository.existsByEmail("manager@neurofleetx.com")) {
            User user = new User();
            user.setEmail("manager@neurofleetx.com");
            user.setPassword(encoder.encode("manager123"));
            user.setName("Morgan Fleet");
            user.setRole(User.Role.FLEET_MANAGER);
            user.setPhone("+1 555-0101");
            user.setApprovalStatus(User.ApprovalStatus.APPROVED);
            userRepository.save(user);
        }

        // Driver
        if (!userRepository.existsByEmail("driver@neurofleetx.com")) {
            User user = new User();
            user.setEmail("driver@neurofleetx.com");
            user.setPassword(encoder.encode("driver123"));
            user.setName("Derek Driver");
            user.setRole(User.Role.DRIVER);
            user.setPhone("+1 555-0102");
            user.setLicenseNumber("DL-2024-001");
            user.setApprovalStatus(User.ApprovalStatus.APPROVED);
            userRepository.save(user);
        }

        // Customer
        if (!userRepository.existsByEmail("customer@neurofleetx.com")) {
            User user = new User();
            user.setEmail("customer@neurofleetx.com");
            user.setPassword(encoder.encode("customer123"));
            user.setName("Casey Customer");
            user.setRole(User.Role.CUSTOMER);
            user.setPhone("+1 555-0103");
            user.setApprovalStatus(User.ApprovalStatus.APPROVED);
            userRepository.save(user);
        }
        
        System.out.println("Demo users and vehicles initialized!");
    }

    private void createVehicle(String name, String plate, String type, String status) {
        Vehicle v = new Vehicle();
        v.setName(name);
        v.setLicensePlate(plate);
        v.setType(type);
        v.setStatus(status);
        vehicleRepository.save(v);
    }
}
