# Arg$1: The migrations dir.
if [ -z "$1" ]; then
 echo "Please specify the migrations folder in the first argument."
 exit 1
fi

DATABASE_URL=$(dotenv -p DATABASE_URL)

# Arg$2: The database url.
if [ -z "$DATABASE_URL" ]; then
 echo "Please specify DATABASE_URL in the .env of the apps/server folder."
 exit 1
fi

# # ✨ The command to execute ✨
goose -dir $1 postgres $DATABASE_URL up