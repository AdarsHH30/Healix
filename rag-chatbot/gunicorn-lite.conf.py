# Gunicorn configuration optimized for 512MB memory limit
import os

# Server socket
bind = f"0.0.0.0:{os.environ.get('PORT', 5000)}"
backlog = 512  # Reduced from 2048

# Worker processes - CRITICAL for memory
workers = 1  # Only 1 worker for 512MB limit
worker_class = "sync"
worker_connections = 100  # Reduced from 1000
timeout = 60  # Increased timeout for slower processing
keepalive = 30  # Reduced keepalive

# Memory management
max_requests = 100  # Restart workers frequently to prevent memory leaks
max_requests_jitter = 10
worker_tmp_dir = "/dev/shm"  # Use memory for tmp files

# Logging - minimal
accesslog = "-"
errorlog = "-"
loglevel = "warning"  # Less verbose logging
access_log_format = '%(h)s "%(r)s" %(s)s %(b)s %(D)s'

# Process naming
proc_name = "rag-chatbot-lite"

# Server mechanics
preload_app = True
enable_stdio_inheritance = True

# Memory optimization
worker_class = "sync"  # Sync workers use less memory than async

# Application
module = "src.app:app"
