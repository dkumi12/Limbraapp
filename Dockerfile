# ============================================
# Stage 1: Build Frontend
# ============================================
FROM node:18 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev for building)
RUN npm install --include=dev --ignore-scripts

# Copy source code
COPY . .

# Build arguments for frontend environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_AI_PROVIDER
ARG VITE_OPENROUTER_API_KEY
ARG VITE_YOUTUBE_API_KEY
ARG VITE_SELECTED_MODEL

# Set frontend env vars
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_AI_PROVIDER=$VITE_AI_PROVIDER
ENV VITE_OPENROUTER_API_KEY=$VITE_OPENROUTER_API_KEY
ENV VITE_YOUTUBE_API_KEY=$VITE_YOUTUBE_API_KEY
ENV VITE_SELECTED_MODEL=$VITE_SELECTED_MODEL

# Build the Vite React app
RUN npm run build

# ============================================
# Stage 2: Production Server (Node.js)
# ============================================
FROM node:18-slim AS production

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

# Copy backend server files
COPY server.js .
COPY api ./api

# Copy compiled frontend from builder
COPY --from=builder /app/dist ./dist

# Expose port (Render sets PORT dynamically, we default to 80 or let Render inject it)
EXPOSE 80

CMD ["node", "server.js"]