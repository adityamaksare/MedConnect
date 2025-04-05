# Deployment Guide for Doctor Appointment System

This guide provides instructions for deploying the Doctor Appointment System to production.

## Prerequisites

- GitHub account
- Render.com account (or similar platform like Netlify, Vercel, Heroku)
- MongoDB Atlas account (already configured)

## Deployment Steps

### 1. Backend Deployment (on Render.com)

1. Log in to your Render.com account
2. Click on "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `doctor-appointment-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Select the appropriate plan (Free is fine for testing)

5. Add environment variables:
   - `PORT`: 5001
   - `MONGO_URI`: Your MongoDB Atlas connection string (already in .env)
   - `JWT_SECRET`: Your JWT secret (already in .env)
   - `NODE_ENV`: production

6. Click "Create Web Service"

### 2. Frontend Deployment (on Render.com, Netlify, or Vercel)

#### Option 1: Render.com

1. Click on "New" and select "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - Name: `doctor-appointment-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

4. Click "Create Static Site"

#### Option 2: Netlify

1. Log in to your Netlify account
2. Click "New site from Git"
3. Connect to GitHub and select your repository
4. Configure the build settings:
   - Base directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `build`
   - (The netlify.toml file already includes these settings)

5. Click "Deploy site"

## Post-Deployment Steps

1. Once both services are deployed, note the URLs of your deployed sites
2. Update the CORS configuration in `backend/server.js` with the actual frontend URL if needed
3. Update the `PRODUCTION_API_URL` in `frontend/src/utils/api.js` with the actual backend URL if needed
4. Re-deploy the services after making these changes

## Checking Your Deployment

1. Visit your deployed frontend URL
2. Try to register a new account and log in
3. Test creating appointments and other functionality

## Troubleshooting

- Check the Render.com logs if you encounter any issues
- Ensure that the environment variables are set correctly
- Verify that CORS is properly configured to allow your frontend to access the backend
- Check that your MongoDB Atlas database is properly connected

## Production Considerations

- Set up proper monitoring and logging
- Configure automatic backups for your MongoDB Atlas database
- Consider setting up a custom domain for your application 