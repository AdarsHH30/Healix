#!/bin/bash
# Build script for Render

echo "🚀 Starting build process..."

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p chroma_db
mkdir -p data/documents

# Set proper permissions
chmod -R 755 chroma_db
chmod -R 755 data

# Run initialization script
echo "🔧 Running initialization..."
python render_init.py

echo "✅ Build completed successfully!"