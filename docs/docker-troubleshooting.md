# Docker Troubleshooting Guide

## Common Docker Desktop Issues on macOS

### Issue: "Cannot connect to the Docker daemon"

This is the most common Docker issue on macOS. Here are step-by-step solutions:

### Solution 1: Manual Docker Desktop Restart

1. **Check Menu Bar**:

   - Look for Docker whale icon in your macOS menu bar (top right)
   - If present, click it and select "Restart Docker Desktop"
   - If not present, proceed to step 2

2. **Force Quit and Restart**:

   ```bash
   # Kill all Docker processes
   sudo pkill -f Docker

   # Wait a moment
   sleep 5

   # Start Docker Desktop
   open -a "Docker Desktop"
   ```

3. **Wait for Full Startup**:
   - Docker Desktop can take 30-90 seconds to fully initialize
   - Watch for the whale icon in the menu bar
   - Icon should show "Docker Desktop is running"

### Solution 2: Reset Docker Desktop

If Docker Desktop won't start properly:

1. **Quit Docker Desktop completely**:

   - Click Docker whale icon in menu bar
   - Select "Quit Docker Desktop"
   - Or force quit: `sudo pkill -f Docker`

2. **Reset Docker Desktop**:

   - Open Docker Desktop application
   - Go to Settings (gear icon)
   - Click "Troubleshoot" in the left sidebar
   - Click "Reset to factory defaults"
   - Confirm the reset

3. **Restart Docker Desktop**:
   - Close Docker Desktop
   - Reopen from Applications folder
   - Wait for full initialization

### Solution 3: Check System Requirements

Docker Desktop requires:

- macOS 10.15 or newer
- At least 4GB of RAM
- VT-x/AMD-v virtualization support
- Sufficient disk space (at least 2GB free)

### Solution 4: Permission Issues

Sometimes Docker has permission issues:

```bash
# Check Docker socket permissions
ls -la /var/run/docker.sock

# If socket doesn't exist, restart Docker Desktop
# If permission denied, try:
sudo chmod 666 /var/run/docker.sock
```

### Solution 5: Alternative Docker Installation

If Docker Desktop continues to fail, try Docker via Homebrew:

```bash
# Remove Docker Desktop first (optional)
# Then install Docker CLI and Docker Machine
brew install docker docker-machine docker-compose

# Create a Docker machine
docker-machine create --driver virtualbox default
docker-machine start default
eval $(docker-machine env default)
```

## Verify Docker is Working

Once Docker is running, test with these commands:

```bash
# Check Docker version
docker --version

# Check Docker daemon connection
docker info

# Test with a simple container
docker run hello-world

# Check Docker Compose
docker-compose --version
```

## Alternative: Run Without Docker

If Docker issues persist, you can run the project locally:

### 1. Install PostgreSQL locally

```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb h8_phase2_gc02
```

### 2. Update environment variables

Create `.env` in project root:

```env
NODE_ENV=development
PORT=8001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=h8_phase2_gc02
DB_USERNAME=postgres
DB_PASSWORD=postgres
# ... other variables
```

### 3. Run development server

```bash
# Install dependencies
npm install

# Run migrations
npm run migrate

# Seed database
npm run seed

# Start development server
npm run dev
```

## Getting Help

If none of these solutions work:

1. **Check Docker Desktop logs**:

   - Docker Desktop → Troubleshoot → View logs
   - Look for specific error messages

2. **Check system resources**:

   - Activity Monitor → Check available RAM
   - Disk Utility → Check free disk space

3. **Restart your Mac**:

   - Sometimes a full system restart resolves Docker issues

4. **Reinstall Docker Desktop**:
   - Download latest version from docker.com
   - Uninstall old version completely
   - Install fresh copy

## Common Error Messages

### "docker: command not found"

- Docker is not installed or not in PATH
- Reinstall Docker Desktop or add to PATH

### "Cannot connect to the Docker daemon"

- Docker daemon is not running
- Follow Solution 1 above

### "dial unix /var/run/docker.sock: connect: permission denied"

- Permission issue with Docker socket
- Try Solution 4 above

### "The docker daemon is not running"

- Docker Desktop is not started
- Start Docker Desktop manually from Applications
