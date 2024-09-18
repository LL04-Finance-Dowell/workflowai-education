#!/bin/bash

# Function to create the network and volume
create_network_and_volume() {
    # Create the Docker network if it doesn't exist
    docker network create workflow-editor-net || echo "Network workflow-editor-net already exists or failed to create"

    # Create the Docker volume if it doesn't exist
    docker volume create --name workflow-db-data || echo "Volume workflow-db-data already exists or failed to create"
}

# Function to start containers
start_containers() {
    create_network_and_volume
    docker-compose up
}

# Function to stop containers
stop_containers() {
    docker-compose down
}

# Function to stop and remove containers
stop_and_remove_containers() {
    docker-compose down --rmi all --volumes --remove-orphans
}

# Main script logic
if [ "$1" == "up" ]; then
    start_containers
elif [ "$1" == "down" ]; then
    if [ "$2" == "delete" ]; then
        stop_and_remove_containers
    else
        stop_containers
    fi
else
    echo "Usage: $0 {up|down [delete]}"
    exit 1
fi
