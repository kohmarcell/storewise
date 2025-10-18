# 🚀 StoreWise Deployment Guide

This guide covers the complete deployment process for the StoreWise POS & Inventory Management system in production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Configuration](#configuration)
4. [Deployment Process](#deployment-process)
5. [Monitoring](#monitoring)
6. [Backup & Recovery](#backup--recovery)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **Server**: Linux (Ubuntu 20.04+ recommended)
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 50GB SSD, Recommended 100GB+
- **CPU**: Minimum 2 cores, Recommended 4+ cores
- **Network**: Stable internet connection with static IP

### Software Requirements
- **Docker**: 20.10+ and Docker Compose 2.0+
- **Domain name** (optional, for SSL)
- **SSL certificates** (recommended for production)

## Environment Setup

### 1. Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create storewise user (optional but recommended)
sudo useradd -m -s /bin/bash storewise
sudo usermod -aG docker storewise
```

### 2. Clone Repository

```bash
# Clone the repository
git clone <repository-url> storewise
cd storewise

# Switch to production branch
git checkout production
```

## Configuration

### 1. Environment Variables

Create a `.env.prod` file in the root directory:

```bash
# Database Configuration
POSTGRES_PASSWORD=your_secure_postgres_password
REDIS_PASSWORD=your_secure_redis_password

# JWT Configuration
JWT_ACCESS_SECRET=your_jwt_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_jwt_refresh_secret_min_32_chars

# Application URLs
FRONTEND_URL=https://your-domain.com
API_URL=https://your-domain.com/api

# Monitoring
GRAFANA_PASSWORD=your_secure_grafana_password

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 2. SSL Certificate Setup

#### Option A: Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Set up auto-renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Option B: Self-Signed Certificate

```bash
# Create SSL directory
mkdir -p ssl

# Generate private key
openssl genrsa -out ssl/private.key 2048

# Generate certificate signing request
openssl req -new -key ssl/private.key -out ssl/certificate.csr

# Generate self-signed certificate
openssl x509 -req -days 365 -in ssl/certificate.csr -signkey ssl/private.key -out ssl/certificate.crt
```

### 3. Monitoring Configuration

Create `monitoring/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'storewise-api'
    static_configs:
      - targets: ['api:3001']
    metrics_path: '/metrics'

  - job_name: 'nginx'
    static_configs:
      - targets: ['web:80']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

## Deployment Process

### 1. Deploy with Docker Compose

```bash
# Create necessary directories
mkdir -p backups uploads ssl monitoring/{grafana/{datasources,dashboards},prometheus}

# Set proper permissions
sudo chown -R $USER:$USER backups uploads ssl monitoring

# Deploy the application
docker-compose -f docker-compose.prod.yml up -d

# Check container status
docker-compose -f docker-compose.prod.yml ps
```

### 2. Database Setup

```bash
# Wait for PostgreSQL to be ready
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U storewise

# Run database migrations
docker-compose -f docker-compose.prod.yml exec api pnpm db:migrate

# Seed initial data (optional)
docker-compose -f docker-compose.prod.yml exec api pnpm db:seed
```

### 3. Verify Deployment

```bash
# Check application health
curl http://localhost:3000/health
curl http://localhost:3001/health

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Monitoring

### 1. Grafana Dashboard

Access Grafana at `http://your-domain.com:3001`

- **Username**: admin
- **Password**: Set in environment variables

### 2. Prometheus Metrics

Access Prometheus at `http://your-domain.com:9090`

### 3. Key Metrics to Monitor

- **Application Health**: Response times, error rates
- **Database**: Connection count, query performance
- **System**: CPU, memory, disk usage
- **Business**: Sales volume, user activity

## Backup & Recovery

### 1. Automated Backups

The system includes automated daily backups:

```bash
# View backup script
cat scripts/backup.sh

# Manual backup
docker-compose -f docker-compose.prod.yml exec backup /backup.sh
```

### 2. Manual Backup Procedures

```bash
# Database backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U storewise storewise_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Application data backup
tar -czf uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz uploads/
```

### 3. Recovery Procedures

```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Restore database
docker-compose -f docker-compose.prod.yml up -d postgres
docker-compose -f docker-compose.prod.yml exec postgres psql -U storewise -d storewise_prod < backup_file.sql

# Restore uploads
tar -xzf uploads_backup.tar.gz

# Start all services
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Common Issues

#### 1. Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# Check resource usage
docker stats

# Restart specific service
docker-compose -f docker-compose.prod.yml restart [service-name]
```

#### 2. Database Connection Issues

```bash
# Check database status
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U storewise

# Test connection from API container
docker-compose -f docker-compose.prod.yml exec api node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect().then(() => console.log('DB connected!')).catch(console.error);
"
```

#### 3. SSL Certificate Issues

```bash
# Check certificate expiration
openssl x509 -in ssl/certificate.crt -noout -dates

# Test SSL configuration
openssl s_client -connect your-domain.com:443
```

#### 4. Performance Issues

```bash
# Check resource usage
docker stats

# Monitor database queries
docker-compose -f docker-compose.prod.yml exec postgres psql -U storewise -c "
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;"
```

### Health Check Scripts

Create `scripts/health-check.sh`:

```bash
#!/bin/bash

echo "🔍 StoreWise Health Check"
echo "========================"

# Check container status
echo "📦 Container Status:"
docker-compose -f docker-compose.prod.yml ps

# Check application health
echo ""
echo "🌐 Application Health:"
curl -s http://localhost:3000/health | jq . || echo "Frontend: Unhealthy"
curl -s http://localhost:3001/health | jq . || echo "API: Unhealthy"

# Check database
echo ""
echo "🗄️  Database Status:"
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U storewise || echo "Database: Unhealthy"

# Check disk space
echo ""
echo "💾 Disk Usage:"
df -h | grep -E "/dev/|Filesystem"

# Check memory usage
echo ""
echo "🧠 Memory Usage:"
free -h

echo ""
echo "✅ Health check completed!"
```

### Log Management

```bash
# View real-time logs
docker-compose -f docker-compose.prod.yml logs -f

# View logs for specific service
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f web

# Log rotation (add to docker-compose.prod.yml)
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## Scaling Considerations

### Horizontal Scaling

For higher traffic loads:

1. **Load Balancer**: Use Nginx or cloud load balancer
2. **Multiple API Instances**: Scale API containers
3. **Database Replication**: Read replicas for read-heavy operations
4. **Caching**: Implement Redis clustering

### Performance Optimization

1. **CDN**: Use CloudFlare or AWS CloudFront
2. **Image Optimization**: Serve static assets via CDN
3. **Database Indexing**: Optimize slow queries
4. **Caching Strategy**: Implement multi-level caching

## Security Best Practices

1. **Regular Updates**: Keep Docker images and dependencies updated
2. **Access Control**: Limit SSH access, use SSH keys
3. **Firewall**: Configure UFW or cloud security groups
4. **Monitoring**: Set up alerts for suspicious activity
5. **Backups**: Store backups in multiple locations

## Support

For deployment issues:

1. Check this documentation first
2. Review logs for error messages
3. Check GitHub Issues for known problems
4. Contact support at support@storewise.com

---

**Last Updated**: January 2024
**Version**: 1.0.0