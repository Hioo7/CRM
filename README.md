# CRM

A simple Customer Relationship Management (CRM) system with a web interface for managing customers and employees.

---

> **New here and just want to check the app?**
> Skip everything below and jump straight to the **[Production Setup](#-production-setup-hosting-on-a-server)** section. That's the quickest way to get the app running with the fewest commands.

---

## What You Need First

Before anything else, install these two programs on your computer:

- **Docker Desktop** — [Download here](https://www.docker.com/products/docker-desktop/)
  - This runs the app and database for you. No other installs needed.
  - After installing, open Docker Desktop and make sure it says "Engine running" at the bottom.

- **Git** (only needed to download the code) — [Download here](https://git-scm.com/downloads)

> **Tip:** If you already have these installed, skip ahead.

---

## Local Setup (Running on Your Computer)

### Step 1 — Download the project

Open a terminal (Command Prompt, PowerShell, or Terminal) and run:

```bash
git clone https://github.com/Pranav-trackway/crm.git
cd crm
```

### Step 2 — Create your local config file

Copy the template to create your config:

```bash
cp .env.local.template .env.local
```

The default values work out of the box for local development. You can open `.env.local` in any text editor if you want to change the default admin password or other settings.

| Setting | What it does |
|---|---|
| `SUPER_ADMIN_EMAIL` | The email you'll use to log in as admin |
| `SUPER_ADMIN_PASSWORD` | The admin password (change this!) |
| `JWT_SECRET` | Secret key for login sessions — change to any long random string |

### Step 3 — Start the app

From the `backend/` folder, run:

```bash
cd backend
docker compose -f docker-compose.dev.yml up --build
```

Wait for the output to show something like `Server is running on port 3000`. This may take a few minutes the first time.

### Step 4 — Open the app

Open your browser and go to: **http://localhost:5173**

Log in with the admin credentials you set in `.env.local` (defaults: `superadmin@crm.local` / `ChangeMe123!`).

### Stopping the app

Press `Ctrl + C` in the terminal, then run:

```bash
docker compose -f docker-compose.dev.yml down
```

---

# PRODUCTION SETUP (Hosting on a Server)

Use this when you want to host the CRM on a real server so your team can access it online.

### Step 1 — Get a server

You need a Linux server (Ubuntu 22.04 recommended). Popular options:
- [DigitalOcean Droplet](https://www.digitalocean.com/) — cheapest starting point
- [AWS EC2](https://aws.amazon.com/ec2/)
- Any VPS provider

Make sure **Docker** and **Docker Compose** are installed on the server. On Ubuntu:

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable --now docker
```

### Step 2 — Download the project on the server

SSH into your server, then:

```bash
git clone https://github.com/Pranav-trackway/crm.git
cd crm
```

### Step 3 — Create your production config file

```bash
cp .env.prod.template .env.prod
```

Open `.env.prod` with a text editor (e.g. `nano .env.prod`) and fill in every field marked `REPLACE_ME`:

| Setting | What to put |
|---|---|
| `POSTGRES_PASSWORD` | A strong password for your database (make it long and random) |
| `DATABASE_URL` | Replace `REPLACE_ME` with the same password you chose above |
| `JWT_SECRET` | A long random string — at least 32 characters (e.g. generate one at [randomkeygen.com](https://randomkeygen.com/)) |
| `SUPER_ADMIN_EMAIL` | The email address for your admin account |
| `SUPER_ADMIN_PASSWORD` | A strong admin password |
| `CORS_ALLOWED_ORIGINS` | Your server's domain or IP, e.g. `http://your-server-ip:8080` |

**Example of a filled-in `DATABASE_URL`:**
```
DATABASE_URL=postgresql://crm_user:MyStr0ngP@ss!@postgres:5432/crm_prod
```

### Step 4 — Start the app

```bash
docker compose up --build -d
```

The `-d` flag runs everything in the background. Wait about a minute for it to start up.

### Step 5 — Check it's running

```bash
docker compose ps
```

All services should show `running` or `healthy`. If something shows `exited`, check the logs:

```bash
docker compose logs backend
```

### Step 6 — Access the app

Open a browser and go to: **http://your-server-ip:8080**

Log in with the admin credentials you set in `.env.prod`.

### Stopping / Restarting

```bash
# Stop
docker compose down

# Restart
docker compose up -d

# See live logs
docker compose logs -f
```

### Updating to a new version

```bash
git pull
docker compose up --build -d
```

---

## Roles

| Role | What they can do |
|---|---|
| **Super Admin** | Create admins and employees, manage everything |
| **Admin** | Create and manage employees |
| **Employee** | View and manage customers |

The first Super Admin account is created automatically on first startup using the credentials in your `.env` file.

---

## Troubleshooting

**The app won't start / Docker errors**
- Make sure Docker Desktop is open and running (local) or the Docker service is started (server).
- Run `docker compose logs` to see what went wrong.

**I forgot the admin password**
- Stop the app, update `SUPER_ADMIN_PASSWORD` in your `.env` file, set `RUN_SEED_ON_START=true`, restart, then set it back to `false`.

**Port already in use**
- Change `BACKEND_PORT` or `FRONTEND_PORT` in your `.env` file and restart.

**Database connection errors**
- Make sure the `DATABASE_URL` in your `.env` file matches your `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` exactly.
