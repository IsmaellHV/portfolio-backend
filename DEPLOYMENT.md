# Deployment Guide

This guide covers how to deploy the Portfolio Backend to various platforms.

## Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud)
- Environment variables configured
- Git repository access

## Environment Variables

Make sure to set these environment variables in your deployment platform:

```bash
# Required
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://your-mongodb-uri
JWT_SECRET=your-jwt-secret

# Optional
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Docker Deployment

### Build and Run Locally

```bash
# Build the image
docker build -t portfolio-backend .

# Run the container
docker run -p 3000:3000 --env-file .env portfolio-backend
```

### Using Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - PORT=3000
      - MONGODB_URI=mongodb://mongo:27017/portfolio
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## Heroku Deployment

### Using Heroku CLI

```bash
# Login to Heroku
heroku login

# Create a new app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set MONGODB_URI=your-mongodb-uri

# Deploy
git push heroku main
```

### Using GitHub Integration

1. Connect your GitHub repository to Heroku
2. Enable automatic deployments
3. Set environment variables in Heroku dashboard
4. Deploy from the Heroku dashboard

## AWS EC2 Deployment

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Install dependencies
npm install

# Build the project
npm run build

# Start with PM2
pm2 start build/index.js --name portfolio-backend

# Setup PM2 to start on boot
pm2 startup
pm2 save
```

### Using AWS ECS

1. Create a Docker image
2. Push to Amazon ECR
3. Create ECS cluster
4. Define task definition
5. Create service
6. Configure load balancer

## Digital Ocean Deployment

### Using App Platform

```yaml
# app.yaml
name: portfolio-backend
services:
  - name: api
    source_dir: /
    github:
      repo: IsmaellHV/portfolio-backend
      branch: main
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: '8080'
      - key: MONGODB_URI
        value: ${DATABASE_URL}
      - key: JWT_SECRET
        value: ${JWT_SECRET}
```

## Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Vercel Deployment

### Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### vercel.json Configuration

```json
{
  "version": 2,
  "builds": [
    {
      "src": "build/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "build/index.js"
    }
  ]
}
```

## Monitoring and Maintenance

### Health Checks

The application includes a health check endpoint:

```bash
GET /api/v1/health
```

### Logs

For production monitoring, consider:

- **PM2**: Built-in log management
- **Docker**: Use log drivers
- **Cloud platforms**: Native logging solutions

### Database Backup

Regular MongoDB backups are recommended:

```bash
# Create backup
mongodump --uri="mongodb://your-uri" --out=backup/

# Restore backup
mongorestore --uri="mongodb://your-uri" backup/
```

## SSL/TLS Configuration

For production deployments, ensure HTTPS is configured:

### Using Let's Encrypt with Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure the PORT environment variable is set correctly
2. **Database connection**: Verify MongoDB URI and network access
3. **Environment variables**: Check all required variables are set
4. **Memory issues**: Monitor memory usage and adjust instance size

### Debugging

Enable debug logging:

```bash
NODE_ENV=development npm start
```

## Security Considerations

- Use environment variables for sensitive data
- Enable CORS only for trusted domains
- Keep dependencies updated
- Use HTTPS in production
- Implement rate limiting
- Regular security audits

## Performance Optimization

- Use PM2 cluster mode for multiple instances
- Implement caching strategies
- Optimize database queries
- Use CDN for static assets
- Monitor performance metrics

---

For more deployment options and detailed configurations, refer to the specific platform documentation.
