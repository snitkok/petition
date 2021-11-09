  DROP TABLE IF EXISTS profiles;
  
  CREATE TABLE profiles(
      id SERIAL PRIMARY KEY,
       user_id INTEGER NOT NULL REFERENCES users(id),
       age INT,
       city TEXT,
       url TEXT

);


