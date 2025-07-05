FROM postgres:latest

EXPOSE 5432

#ENV POSTGRES_DB=wearify
#ENV POSTGRES_USER=sthapliyal
#ENV POSTGRES_PASSWORD=1319

RUN apt-get update && apt-get install -y bash
RUN useradd -m -s /bin/bash wearify && echo "wearify:1234" | chpasswd

COPY wearify.pgsql /wearify.pgsql
COPY init-db.sh /docker-entrypoint-initdb.d/init-db.sh

# This ensures Postgres listens on all IPs from the start
CMD ["postgres", "-c", "listen_addresses=*"]