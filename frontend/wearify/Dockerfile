# Step 1: Build the React app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV REACT_APP_IMAGE_PATH="/api/"
ENV REACT_APP_SERVER_URL="/api/"

RUN echo "Server URL is $REACT_APP_SERVER_URL"
RUN npm run build


# Step 2: Deploy the build files to nginx for serving
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

COPY ./config/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]