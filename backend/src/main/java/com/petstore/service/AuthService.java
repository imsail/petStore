package com.petstore.service;

import com.petstore.dto.AuthResponse;
import com.petstore.dto.RegisterDto;
import com.petstore.entity.Customer;
import com.petstore.entity.Role;
import com.petstore.entity.User;
import com.petstore.exception.EmailAlreadyExistsException;
import com.petstore.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerService customerService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       CustomerService customerService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.customerService = customerService;
    }

    @Transactional
    public AuthResponse register(RegisterDto dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new EmailAlreadyExistsException("Email already registered: " + dto.email());
        }

        Customer customer = new Customer();
        customer.setName(dto.name());
        customer.setEmail(dto.email());
        customer.setPhone(dto.phone());
        customer.setAddress(dto.address());
        customer = customerService.saveEntity(customer);

        User user = new User();
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(Role.CUSTOMER);
        user.setCustomer(customer);
        user = userRepository.save(user);

        return toAuthResponse(user);
    }

    public AuthResponse toAuthResponse(User user) {
        return new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getRole().name(),
            user.getCustomer() != null ? user.getCustomer().getId() : null,
            user.getCustomer() != null ? user.getCustomer().getName() : null
        );
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
