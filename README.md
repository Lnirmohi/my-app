# Next.js Project with PostgreSQL and Prisma

This is a Next.js project configured with PostgreSQL running in Docker and Prisma for database management.

## Prerequisites

- **Node.js**: Version 20
- **Docker**: Latest version
- **Docker Compose**: Latest version
- **Prisma CLI**: Installed globally or as a dev dependency

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install Dependencies**
   Ensure you are using Node.js version 20. Install the project dependencies:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and configure the following:
   ```env
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<database>?schema=public"
   ```
   Replace `<user>`, `<password>`, and `<database>` with your PostgreSQL credentials and database name.

4. **Docker Compose Configuration**
   Ensure you have a `docker-compose.yml` file configured for PostgreSQL. Example:
   ```yaml
   version: '3.8'
   services:
     db:
       image: postgres:latest
       environment:
         POSTGRES_USER: <user>
         POSTGRES_PASSWORD: <password>
         POSTGRES_DB: <database>
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
   volumes:
     postgres_data:
   ```
   Update `<user>`, `<password>`, and `<database>` to match your `.env` file.

5. **Run Docker Compose**
   Start the PostgreSQL container:
   ```bash
   docker-compose up -d
   ```

6. **Prisma Setup and Migrations**
   - Initialize Prisma (if not already set up):
     ```bash
     npx prisma init
     ```
   - Run Prisma migrations to set up the database schema:
     ```bash
     npx prisma migrate dev --name init
     ```
     For more details on running migrations, refer to the [Prisma documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate).

7. **Start the Next.js Application**
   Run the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Additional Commands

- **Generate Prisma Client**:
  ```bash
  npx prisma generate
  ```
- **View Prisma Studio** (GUI for database):
  ```bash
  npx prisma studio
  ```
- **Stop Docker Containers**:
  ```bash
  docker-compose down
  ```

## Notes

- Ensure Node.js version 20 is active (use `nvm use 20` if using NVM).
- The PostgreSQL container uses the latest available image.
- Keep your `.env` file secure and do not commit it to version control.

## Troubleshooting

- **Database Connection Issues**: Verify the `DATABASE_URL` in `.env` matches the Docker Compose configuration.
- **Migration Errors**: Check the Prisma schema (`schema.prisma`) and ensure the database is running.
- **Port Conflicts**: Ensure port `5432` is free or modify the port mapping in `docker-compose.yml`.

For further assistance, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)