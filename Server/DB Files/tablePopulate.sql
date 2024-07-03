-- Insert demo users with bcrypt-hashed passwords
INSERT INTO users (username, password, email, full_name, role) VALUES
('john_waiter', '$2b$10$rNE4b4ObjrA8B3C5E8OYUeLu1z9eWoHnIlf5qB6CXZJu8r7TsJTHy', 'john@example.com', 'John Doe', 'waiter'),
('sarah_receptionist', '$2b$10$rNE4b4ObjrA8B3C5E8OYUeLu1z9eWoHnIlf5qB6CXZJu8r7TsJTHy', 'sarah@example.com', 'Sarah Smith', 'receptionist'),
('mike_admin', '$2b$10$rNE4b4ObjrA8B3C5E8OYUeLu1z9eWoHnIlf5qB6CXZJu8r7TsJTHy', 'mike@example.com', 'Mike Johnson', 'admin');


-- Insert demo menu items
INSERT INTO menu_items (name, description, price, category, is_available) VALUES
('Margherita Pizza', 'Classic tomato and mozzarella pizza', 12.99, 'Pizza', TRUE),
('Pepperoni Pizza', 'Pizza with tomato sauce, mozzarella, and pepperoni', 14.99, 'Pizza', TRUE),
('Caesar Salad', 'Romaine lettuce with Caesar dressing and croutons', 8.99, 'Salad', TRUE),
('Spaghetti Bolognese', 'Spaghetti with meat sauce', 13.99, 'Pasta', TRUE),
('Tiramisu', 'Classic Italian coffee-flavored dessert', 6.99, 'Dessert', TRUE);

-- Insert demo tables
INSERT INTO tables (table_number, capacity, status) VALUES
(1, 2, 'available'),
(2, 4, 'available'),
(3, 6, 'occupied'),
(4, 2, 'reserved');

-- Insert demo active orders
INSERT INTO active_orders (user_id, table_id, status) VALUES
(1, 3, 'in_progress');

-- Insert demo active order items
INSERT INTO active_order_items (active_order_id, item_id, quantity) VALUES
(1, 1, 1),
(1, 3, 2);

-- Insert demo finalized orders
INSERT INTO orders (user_id, table_id, status, total_amount, completed_at) VALUES
(1, 2, 'completed', 35.97, NOW() - INTERVAL 1 HOUR);

-- Insert demo order items for finalized orders
INSERT INTO order_items (order_id, item_id, quantity, price_at_order) VALUES
(1, 2, 1, 14.99),
(1, 4, 1, 13.99),
(1, 5, 1, 6.99);

-- Insert demo sales
INSERT INTO sales (order_id, user_id, amount, date, payment_method) VALUES
(1, 1, 35.97, CURDATE(), 'credit_card');

-- Insert demo expenses
INSERT INTO expenses (user_id, expense_type, amount, date, description) VALUES
(3, 'Inventory', 500.00, CURDATE(), 'Weekly grocery purchase'),
(3, 'Utilities', 200.00, CURDATE(), 'Electricity bill');

-- Insert demo sales report
INSERT INTO sales_reports (report_date, total_sales, total_orders, average_order_value) VALUES
(CURDATE(), 35.97, 1, 35.97);