FROM mongo:latest

EXPOSE 27017

RUN apt-get update && apt-get install -y bash
RUN useradd -m -s /bin/bash wearify && echo "wearify:1234" | chpasswd

COPY collections/ /collections/

RUN chmod +x /collections/init-db.sh

CMD ["bash", "-c", "mongod --bind_ip 0.0.0.0 & sleep 5 && /collections/init-db.sh && tail -f /dev/null"]