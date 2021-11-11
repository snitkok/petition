  DROP TABLE IF EXISTS profiles;
  
  CREATE TABLE profiles(
      id SERIAL PRIMARY KEY,
      user_id  INTEGER NOT NULL UNIQUE REFERENCES users(id),
      age INTEGER,
      city TEXT,
      url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


