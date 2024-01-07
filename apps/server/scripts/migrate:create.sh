# migrate-create is a wrapper around the goose command.
# Why this instead of putting it directly inside `package.json`?
# So that I can perform arg checks, and display appropriate error messages.
# ---
# After some iterations, dotenv here isn't actually necessary anymore.
# I initially used the dotenv-cli so that I can get the database URL from .env
# Which is the `""` in the command below.
# ---
# This is the first "migrate:" script so I'll document my findings here:
# I found that dotenv-cli actually likes it if it's "wrapped in .sh files" or 
# if the main command is "subscript encapsulated". 

# Arg$1: The migrations dir.
if [ -z "$1" ]; then
 echo "Please specify the migrations folder in the first argument."
 exit 1
fi

# Arg$2: The migration name.
if [ -z "$2" ]; then
 echo "No migration name found. Please add a name."
 exit 1
fi


# ✨ The command to execute ✨
dotenv -- goose -dir $1 postgres "" create $2 sql