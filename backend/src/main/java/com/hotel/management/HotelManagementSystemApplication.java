package com.hotel.management;

import com.hotel.management.entity.Booking;
import com.hotel.management.entity.Role;
import com.hotel.management.entity.Room;
import com.hotel.management.entity.User;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.RoomRepository;
import com.hotel.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;

@SpringBootApplication
public class HotelManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(HotelManagementSystemApplication.class, args);
	}

	@Bean
	public CommandLineRunner initializeData(UserRepository userRepository, 
										   RoomRepository roomRepository, 
										   BookingRepository bookingRepository, 
										   PasswordEncoder passwordEncoder) {
		return args -> {
			// Create admin user if not exists
			if (!userRepository.findByEmail("admin@hotel.com").isPresent()) {
				User adminUser = new User();
				adminUser.setName("Admin User");
				adminUser.setEmail("admin@hotel.com");
				adminUser.setPassword(passwordEncoder.encode("password"));
				adminUser.setRole(Role.ROLE_ADMIN);
				userRepository.save(adminUser);
				System.out.println("Admin user created: admin@hotel.com / password");
			}

			// Create sample rooms if none exist
			if (roomRepository.count() == 0) {
				Room room1 = new Room();
				room1.setRoomNumber("101");
				room1.setType("Standard");
				room1.setPrice(new BigDecimal("100.00"));
				room1.setAvailable(true);

				Room room2 = new Room();
				room2.setRoomNumber("102");
				room2.setType("Standard");
				room2.setPrice(new BigDecimal("100.00"));
				room2.setAvailable(true);

				Room room3 = new Room();
				room3.setRoomNumber("201");
				room3.setType("Deluxe");
				room3.setPrice(new BigDecimal("150.00"));
				room3.setAvailable(true);

				Room room4 = new Room();
				room4.setRoomNumber("202");
				room4.setType("Deluxe");
				room4.setPrice(new BigDecimal("150.00"));
				room4.setAvailable(true);

				Room room5 = new Room();
				room5.setRoomNumber("301");
				room5.setType("Suite");
				room5.setPrice(new BigDecimal("250.00"));
				room5.setAvailable(true);

				roomRepository.saveAll(Arrays.asList(room1, room2, room3, room4, room5));
				System.out.println("Sample rooms created successfully");
			}

			// Create sample customer and booking if none exist
			if (bookingRepository.count() == 0) {
				User customer = userRepository.findByEmail("customer@hotel.com").orElse(null);
				if (customer == null) {
					customer = new User();
					customer.setName("Sample Customer");
					customer.setEmail("customer@hotel.com");
					customer.setPassword(passwordEncoder.encode("password"));
					customer.setRole(Role.ROLE_CUSTOMER);
					customer = userRepository.save(customer);
				}

				Room sampleRoom = roomRepository.findByRoomNumber("101").orElse(null);
				if (sampleRoom != null) {
					Booking booking = new Booking();
					booking.setUser(customer);
					booking.setRoom(sampleRoom);
					booking.setCheckInDate(LocalDate.now().plusDays(1));
					booking.setCheckOutDate(LocalDate.now().plusDays(3));
					bookingRepository.save(booking);
					System.out.println("Sample booking created successfully");
				}
			}
		};
	}
}
