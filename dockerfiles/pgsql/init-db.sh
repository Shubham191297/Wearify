# #!/bin/bash
# set -e

# echo "Waiting for Postgres to be ready..."
# until pg_isready -U sthapliyal > /dev/null 2>&1; do
#   sleep 1
# done

# echo "Importing wearify.pgsql into database wearify..."
# psql -U sthapliyal -d wearify -f /wearify.pgsql

# echo "✅ Import done."

set -e

echo "Waiting for Postgres to be ready..."
until pg_isready -U "$POSTGRES_USER" > /dev/null 2>&1; do
  sleep 1
done

echo "Importing wearify.pgsql into database $POSTGRES_DB..."
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /wearify.pgsql

echo "✅ Import done."
