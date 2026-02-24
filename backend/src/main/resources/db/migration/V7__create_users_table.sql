CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    customer_id BIGINT REFERENCES customers(id),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Default admin user: admin@petstore.com / admin123
INSERT INTO users (email, password, role, enabled)
VALUES ('admin@petstore.com', '$2b$10$Q0/cTkbYW2wx9W2LqXKcHet0C8oxw3HNALEO5StyOB7Ss2hsrhPbq', 'ADMIN', TRUE);
