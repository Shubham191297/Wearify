# Step 1: Build the React app
FROM node:18 AS builder

WORKDIR /app

# Clone repo and move to frontend
COPY . .

ENV REACT_APP_IMAGE_PATH="/api/"
ENV REACT_APP_SERVER_URL="/api/"

RUN echo "Server URL is $REACT_APP_SERVER_URL"
# Build the app
RUN npm run build


FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

COPY ./config/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]