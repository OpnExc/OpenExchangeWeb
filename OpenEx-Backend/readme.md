1. Pull the PostgreSQL image

```
docker pull postgres:latest
```

2. Create and start the PostgreSQL container

```
docker run --name openex-postgres \
  -e POSTGRES_USER=openex_user \
  -e POSTGRES_PASSWORD=secure_password123 \
  -e POSTGRES_DB=openex_db \
  -p 5432:5432 \
  -d postgres:latest
```

3. Verify the container is running

```
docker ps
```

4. Create or modify your .env file

```
DB_HOST=localhost
DB_USER=openex_user
DB_PASSWORD=secure_password123
DB_NAME=openex_db
DB_PORT=5432
JWT_SECRET=a3I9bbJlR7ZvezMpMeJmZMfEHbQK7TIpDD1jGyUcRRI=
```

5. Using the provided Go script

```
go run generate_secret.go
```