#!/bin/bash
# Lightweight build script for Render 512MB limit

echo "🚀 Starting lightweight build for 512MB limit..."

# Install minimal Python dependencies
echo "📦 Installing minimal dependencies..."
pip install --upgrade pip --no-cache-dir
pip install -r requirements-lite.txt --no-cache-dir

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p chroma_db
mkdir -p data/documents

# Set proper permissions
chmod -R 755 chroma_db
chmod -R 755 data

# Clean up pip cache to save memory
echo "🧹 Cleaning up to save memory..."
pip cache purge
rm -rf ~/.cache/pip

echo "✅ Lightweight build completed!"