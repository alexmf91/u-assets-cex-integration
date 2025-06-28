#!/bin/bash

# Load environment variables from .env if it exists
if [ -f .env ]; then
	set -a
	# shellcheck disable=SC1091
	source .env
	set +a
fi

if [ -z "$DATABASE_URL" ]; then
	echo "DATABASE_URL is not set. Please set it in your .env file."
	exit 1
fi

echo "Seeding Supabase DB at $DATABASE_URL ..."
npx prisma db seed
