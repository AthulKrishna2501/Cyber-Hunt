#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=================================="
echo " Starting Backend Testing Suite "
echo "=================================="

echo "Running Go Vet..."
cd backend
go vet ./...

echo "Running Go Tests..."
go test -v ./...

echo "Backend Tests Completed Successfully!"
echo "=================================="
