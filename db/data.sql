INSERT INTO "Identifier" DEFAULT VALUES;
INSERT INTO "Account" ("id", "login", "password")
VALUES (lastval(), 'admin', 'ypMEd9FwvtlOjcvH94iICQ==:V6LnSOVwXzENxeLCJk59Toadea7oaA1IxYulAOtKkL9tBxjEPOw085vYalEdLDoe8xbrXQlhh7QRGzrSe8Bthw==');

INSERT INTO "Identifier" DEFAULT VALUES;
INSERT INTO "Account" ("id", "login", "password") 
VALUES (lastval(), 'alex', '$scrypt$N=32768,r=8,p=1,maxmem=67108864$pfFUcL2OHuK2KpHMSwYjkkfvWqTjLsBBXku9sGDYhUw$5VgNfrcdnUEszwTnUcORdgBbnQ+4NZbWn0v2u44/kyIwI3umY4E1N0gtsGHG+1GTEkYV83eAK56FyoO1zaRJUQ');

INSERT INTO "Identifier" DEFAULT VALUES;
INSERT INTO "Account" ("id", "login", "password")
VALUES (lastval(), 'user', 'r8zb8AdrlPSh5wNy6hqOxg==:HyO5rvOFLtwzU+OZ9qFi3ADXlVccDJWGSfUS8mVq43spJ6sxyliUdW3i53hOPdkFAtDn3EAQMttOlIoJap1lTQ==');

INSERT INTO "Identifier" DEFAULT VALUES;
INSERT INTO "Account" ("id", "login", "password")
VALUES (lastval(), 'iskandar', 'aqX1O4bKXiwC/Jh2EKNIYw==:bpE4TARNg09vb2Libn1c00YRxcvoklB9zVSbD733LwQQFUuAm7WHP85PbZXwEbbeOVPIFHgflR4cvEmvYkr76g==');

-- Examples login/password
-- admin/123456
-- marcus/marcus
-- user/nopassword
-- iskandar/zulqarnayn

INSERT INTO "Area" ("name", "ownerId") VALUES
  ('Metarhia', (SELECT "id" FROM "Account" WHERE "login" = 'marcus')),
  ('Metaeducation', (SELECT "id" FROM "Account" WHERE "login" = 'marcus'));

INSERT INTO "AreaAccount" ("areaId", "accountId") VALUES
  ((SELECT "areaId" FROM "Area" WHERE "name" = 'Metarhia'), (SELECT "id" FROM "Account" WHERE "login" = 'admin')),
  ((SELECT "areaId" FROM "Area" WHERE "name" = 'Metarhia'), (SELECT "id" FROM "Account" WHERE "login" = 'marcus')),
  ((SELECT "areaId" FROM "Area" WHERE "name" = 'Metarhia'), (SELECT "id" FROM "Account" WHERE "login" = 'user')),
  ((SELECT "areaId" FROM "Area" WHERE "name" = 'Metarhia'), (SELECT "id" FROM "Account" WHERE "login" = 'iskandar')),
  ((SELECT "areaId" FROM "Area" WHERE "name" = 'Metaeducation'), (SELECT "id" FROM "Account" WHERE "login" = 'admin')),
  ((SELECT "areaId" FROM "Area" WHERE "name" = 'Metaeducation'), (SELECT "id" FROM "Account" WHERE "login" = 'marcus')),
  ((SELECT "areaId" FROM "Area" WHERE "name" = 'Metaeducation'), (SELECT "id" FROM "Account" WHERE "login" = 'user')),
  ((SELECT "areaId" FROM "Area" WHERE "name" = 'Metaeducation'), (SELECT "id" FROM "Account" WHERE "login" = 'iskandar'));
