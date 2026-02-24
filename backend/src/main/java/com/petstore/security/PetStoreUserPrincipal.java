package com.petstore.security;

import com.petstore.entity.Role;
import com.petstore.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class PetStoreUserPrincipal implements UserDetails {

    private final Long userId;
    private final String email;
    private final String password;
    private final Role role;
    private final Long customerId;
    private final boolean enabled;

    public PetStoreUserPrincipal(User user) {
        this.userId = user.getId();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.role = user.getRole();
        this.customerId = user.getCustomer() != null ? user.getCustomer().getId() : null;
        this.enabled = user.isEnabled();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return email; }

    @Override
    public boolean isEnabled() { return enabled; }

    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
    public Long getCustomerId() { return customerId; }
}
