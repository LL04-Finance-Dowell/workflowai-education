# 100018-dowellWorkflowAi-testing

To clone this branch, use the following command:

```bash
git clone --single-branch -b frontend https://github.com/LL04-Finance-Dowell/100018-dowellWorkflowAi-testing.git
```
Happy Hacking.

---

# Docker Management Script

This repository includes a shell script named `run_docker.sh` to manage Docker containers and networks. The script allows you to create necessary Docker networks and volumes, start and stop containers, and optionally remove them.

## Script Overview

The `run_docker.sh` script provides commands to manage Docker containers with the following options:
- ** `chmod +x run_docker.sh`**: Ensure the script is runnable.
- **`up`**: Create the network and volume (if they don’t already exist) and start the Docker containers.
- **`down`**: Stop the Docker containers. Optionally, remove the containers, networks, and volumes if `delete` is specified.

## Prerequisites

Before using the script, ensure you have Docker and Docker Compose installed on your system. You can check the installation by running:

```bash
docker --version
docker-compose --version
```

## Script Usage

1. **Start Containers**

   To create the Docker network and volume (if they don’t already exist) and start the Docker containers, use the following command:

   ```bash
   ./run_docker.sh up
   ```

   This command runs `docker-compose up` to start the containers defined in your `docker-compose.yml` file.

2. **Stop Containers**

   To stop the Docker containers without removing them, use:

   ```bash
   ./run_docker.sh down
   ```

   This command runs `docker-compose down` to stop the containers.

3. **Stop and Remove Containers**

   To stop and remove the Docker containers, networks, and volumes, use:

   ```bash
   ./run_docker.sh down delete
   ```

   This command runs `docker-compose down --rmi all --volumes --remove-orphans` to remove all related Docker resources.

## Script Details

### `create_network_and_volume()`

Creates a Docker network named `workflow-editor-net` and a Docker volume named `workflow-db-data`. If they already exist, it will output a message indicating that.

### `start_containers()`

Calls `create_network_and_volume` to ensure the network and volume exist and then starts the Docker containers using `docker-compose up`.

### `stop_containers()`

Stops the running Docker containers using `docker-compose down`.

### `stop_and_remove_containers()`

Stops and removes the Docker containers, networks, and volumes using `docker-compose down --rmi all --volumes --remove-orphans`.

## Example

To start your Docker containers, run:

```bash
./run_docker.sh up
```

To stop and remove all Docker containers, networks, and volumes, run:

```bash
./run_docker.sh down delete
```

## Notes

- Make sure your `docker-compose.yml` file is properly configured in the same directory as the script.
- The script needs execution permissions. You can grant this with:

  ```bash
  chmod +x run_docker.sh
  ```

- Replace `run_docker.sh` with the name of your shell script if different.

---