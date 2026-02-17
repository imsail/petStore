CREATE TABLE pets (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    age INTEGER,
    price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    image_url VARCHAR(500),
    description TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    category_id BIGINT REFERENCES categories(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pets_category_id ON pets(category_id);
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pets_type ON pets(type);
CREATE INDEX idx_pets_price ON pets(price);
