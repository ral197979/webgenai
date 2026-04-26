# Deployment Guide - WebGenAI

## Deploy to Render.com (Recommended)

### Step-by-Step Instructions

1. **Create Render Account**
   - Go to https://render.com
   - Sign up and log in

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Select "Deploy an existing repo"
   - Search for and select `ral197979/webgenai`
   - Click "Connect"

3. **Configure Service**
   - **Name**: `webgenai` (or choose your own)
   - **Environment**: Node
   - **Plan**: Free tier works initially
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **Add Environment Variable**
   - Under "Environment", click "Add Secret"
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: (your Anthropic API key from https://console.anthropic.com)

5. **Deploy**
   - Click "Create Web Service"
   - Render builds and deploys automatically
   - Service URL appears when ready

## Deploy to Vercel (Alternative)

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import repository: `ral197979/webgenai`
4. In Environment Variables, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: (your API key)
5. Click "Deploy"

## Deploy to Own Server

### Using Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t webgenai .
docker run -e ANTHROPIC_API_KEY=your_key -p 3000:3000 webgenai
```

### Using systemd

1. Clone repo on server
2. `npm install && npm run build`
3. Create `/etc/systemd/system/webgenai.service`:

```ini
[Unit]
Description=WebGenAI
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/home/user/webgenai-app
Environment="ANTHROPIC_API_KEY=your_key"
Environment="NODE_ENV=production"
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable webgenai
sudo systemctl start webgenai
```

## Monitoring & Troubleshooting

### Check Logs
- **Render**: Dashboard → Logs tab
- **Vercel**: Deployments → Select deployment → Logs

### Common Issues

**API Key not recognized**
- Verify key is correct at https://console.anthropic.com
- Check environment variable is set (not in code)
- Restart service after adding key

**Build fails**
- Check Node version (need 18+)
- Run `npm install` locally to verify dependencies
- Check for TypeScript/ESLint errors

**Rate limits**
- Implement request queuing for production
- Monitor usage at console.anthropic.com

## Testing After Deployment

1. Open deployed URL
2. Enter test prompt: "Simple landing page for a coffee shop"
3. Select "Aurora" style
4. Click "Generate Website"
5. Verify HTML generates within 30 seconds
6. Download or preview the output

## Performance Tips

- Use Render's paid tier for better performance
- CDN is included with Render deployment
- Consider caching generated websites in a database for common prompts
- Monitor API costs at console.anthropic.com

## Support

For issues:
- Check Render/Vercel logs
- Verify ANTHROPIC_API_KEY is set
- Test API key directly: `curl -H "x-api-key: YOUR_KEY" https://api.anthropic.com/v1/models`
- Check GitHub issues or contact maintainer
