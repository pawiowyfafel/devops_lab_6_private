FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM builder AS tester
RUN npm test

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

ARG GIT_COMMIT=unknown
ARG BUILD_NUMBER=unknown
LABEL org.opencontainers.image.revision="${GIT_COMMIT}" \
      ci.build.number="${BUILD_NUMBER}"

COPY package*.json ./
RUN npm install --only=production
COPY public ./public
COPY app.js server.js ./

EXPOSE 3000
CMD ["npm", "start"]