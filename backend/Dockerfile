FROM node:18

EXPOSE 5000

# System setup
RUN apt-get update && \
    apt-get install -y git bash sudo && \
    useradd -m -s /bin/bash wearify && \
    echo "wearify:1234" | chpasswd && \
    usermod -aG sudo wearify && \
    mkdir -p /home/wearify/app && \
    chown -R wearify:wearify /home/wearify

WORKDIR /home/wearify/app

COPY package*.json ./

RUN npm install

COPY . .

# Now switch user
USER wearify

CMD ["npm", "start"]

# RUN sed -i 's|serverHost: "localhost"|serverHost: "0.0.0.0"|g' utils/serverURL.js
# RUN sed -i 's|http://localhost:3000||g' utils/serverURL.js
# RUN sed -i 's|5001|5000|g' utils/serverURL.js
# RUN sed -i 's|mongodb://localhost:27017|mongodb://wearify-mongodb:27017|g' utils/db-url.js
# RUN sed -i 's|localhost|wearify-postgres|g' utils/pgsql-database.js
# # RUN sed -i 's|user|username|g' utils/pgsql-database.js
# RUN sed -i 's|app.use("/"|app.use("/api"|g' app.js
# RUN sed -i 's|app.use("/auth"|app.use("/api/auth"|g' app.js
# RUN sed -i 's|app.use("/admin"|app.use("/api/admin"|g' app.js
# # CLUSTER_API_ENDPOINT_ROUTE



# CMD ["npm", "start"]
# CMD ["tail", "-f", "/dev/null"]
