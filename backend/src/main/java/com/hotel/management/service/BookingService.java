package com.hotel.management.service;

import com.hotel.management.entity.Booking;
import com.hotel.management.entity.Room;
import com.hotel.management.entity.User;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Transactional
    public Booking createBooking(Booking booking) {
        Room room = booking.getRoom();
        if (!room.isAvailable()) {
            throw new RuntimeException("Room not available");
        }
        room.setAvailable(false);
        roomRepository.save(room);
        return bookingRepository.save(booking);
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        Room room = booking.getRoom();
        room.setAvailable(true);
        roomRepository.save(room);
        bookingRepository.delete(booking);
    }

    public List<Booking> getBookingsForUser(User user) {
        return bookingRepository.findByUser(user);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
