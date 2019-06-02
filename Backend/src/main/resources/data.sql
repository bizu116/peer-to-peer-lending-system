INSERT INTO account (username, password, email, role) VALUES ('admin', 'admin', 'mail@admin.com', 'ROLE_ADMIN');
INSERT INTO account (username, password, email, role) VALUES ('user1', 'pass1', 'mail1', 'ROLE_USER');
INSERT INTO account (username, password, email, role) VALUES ('user2', 'pass2', 'mail2', 'ROLE_USER');

INSERT INTO deal (status) VALUES ('transitioning'), ('transitioning'), ('pending'), ('done');

INSERT INTO request (from_account_id, to_account_id, deal_id, amount) VALUES (2, 3, 1, 10);
INSERT INTO request (from_account_id, to_account_id, deal_id, amount) VALUES (3, 2, 2, 20);
INSERT INTO request (from_account_id, deal_id, amount) VALUES (2, 3, 200);
INSERT INTO request (from_account_id, to_account_id, deal_id, amount) VALUES (3, 2, 4, 500);