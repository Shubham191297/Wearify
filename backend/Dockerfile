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

RUN chown -R wearify:wearify data
RUN chown -R wearify:wearify images

USER wearify

CMD ["npm", "start"]
