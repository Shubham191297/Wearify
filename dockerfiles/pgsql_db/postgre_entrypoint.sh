#!/bin/bash
set -e

PGDATA=/var/lib/postgresql/data
PG_BIN=/usr/lib/postgresql/16/bin
DUMP_FILE=/tmp/wearify.pgsql

echo "[+] Copy dump to /tmp and set ownership"
cp /home/wearify/Wearify/backend/wearify.pgsql "$DUMP_FILE"
chown postgres:postgres "$DUMP_FILE"

export PGDATA

if [ ! -s "$PGDATA/PG_VERSION" ]; then
  echo '[+] Initializing DB cluster...'
  $PG_BIN/initdb -D "$PGDATA"

  echo '[+] Enabling remote connections...'
  echo "listen_addresses = '*'" >> "$PGDATA/postgresql.conf"
  echo "host all all all scram-sha-256" >> "$PGDATA/pg_hba.conf"
fi

echo '[+] Starting Postgres temporarily...'
$PG_BIN/pg_ctl -D "$PGDATA" -o "-c listen_addresses=''" -w start

echo '[+] Ensuring role postgres exists...'
psql -v ON_ERROR_STOP=1 -c "DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'postgres') THEN
    CREATE ROLE postgres LOGIN SUPERUSER;
  END IF;
END \$\$;"

echo "[+] Ensuring role $POSTGRES_USER exists..."
psql -v ON_ERROR_STOP=1 -c "DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$POSTGRES_USER') THEN
    CREATE ROLE $POSTGRES_USER LOGIN PASSWORD '$POSTGRES_PASSWORD';
  END IF;
END \$\$;"

echo "[+] Ensuring database $POSTGRES_DB exists..."
psql -v ON_ERROR_STOP=1 -c "CREATE DATABASE \"$POSTGRES_DB\" OWNER \"$POSTGRES_USER\";" || true

echo '[+] Fixing dump ownership...'
sed -i "s/OWNER TO postgres;/OWNER TO $POSTGRES_USER;/g" "$DUMP_FILE"

echo '[+] Restoring DB if needed...'
if ! psql -v ON_ERROR_STOP=1 -d "$POSTGRES_DB" -c '\dt' | grep -q users; then
  psql -v ON_ERROR_STOP=1 -d "$POSTGRES_DB" -f "$DUMP_FILE"
else
  echo '[=] DB already initialized, skipping restore.'
fi

echo '[+] Stopping temporary Postgres...'
$PG_BIN/pg_ctl -D "$PGDATA" -m fast -w stop

echo '[+] Starting Postgres in foreground...'
exec postgres
