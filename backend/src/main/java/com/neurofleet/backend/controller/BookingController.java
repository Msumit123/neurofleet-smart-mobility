package com.neurofleet.backend.controller;

import com.neurofleet.backend.model.Booking;
import com.neurofleet.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    BookingRepository bookingRepository;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingRepository.save(booking);
    }

    @GetMapping("/customer/{id}")
    public List<Booking> getCustomerBookings(@PathVariable Long id) {
        return bookingRepository.findByCustomerId(id);
    }
}
