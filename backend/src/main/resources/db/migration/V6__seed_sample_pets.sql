INSERT INTO pets (name, type, breed, age, price, status, description, stock, category_id) VALUES
('Buddy', 'Dog', 'Golden Retriever', 2, 499.99, 'AVAILABLE', 'Friendly and energetic golden retriever puppy', 3, (SELECT id FROM categories WHERE name = 'Dog')),
('Whiskers', 'Cat', 'Siamese', 1, 299.99, 'AVAILABLE', 'Elegant Siamese cat with blue eyes', 5, (SELECT id FROM categories WHERE name = 'Cat')),
('Polly', 'Bird', 'African Grey Parrot', 3, 799.99, 'AVAILABLE', 'Intelligent talking parrot', 2, (SELECT id FROM categories WHERE name = 'Bird')),
('Nemo', 'Fish', 'Clownfish', 1, 29.99, 'AVAILABLE', 'Vibrant orange clownfish', 20, (SELECT id FROM categories WHERE name = 'Fish'));
