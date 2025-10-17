#!/bin/bash
# Ultra-minimal build script for 512MB - only essential packages

echo "🚀 Starting ultra-minimal build..."

# Install only essential packages
echo "📦 Installing essential packages..."
pip install --upgrade pip --no-cache-dir
pip install -r requirements-minimal.txt --no-cache-dir

# Create directories
echo "📁 Creating directories..."
mkdir -p data

# Clean up
echo "🧹 Cleaning up..."
pip cache purge

echo "✅ Ultra-minimal build completed!"