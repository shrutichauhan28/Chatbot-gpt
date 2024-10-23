import json
from pymongo import MongoClient
import os

# Print current working directory for debugging
print("Current working directory:", os.getcwd())

# Load the JSON file (assuming it's in the same directory as this script)
with open('./chat_sessions.json', 'r') as file:
    data = json.load(file)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['my_database']
collection = db['queries_responses']

# Insert the data into MongoDB
for query_id, conversations in data.items():
    document = {
        "query_id": query_id,
        "conversations": conversations
    }
    collection.insert_one(document)

print("Data successfully inserted into MongoDB!")


# Function to get the last 4-5 chat sessions
def get_last_chat_sessions(limit=5):
    last_sessions = list(collection.find().sort("_id", -1).limit(limit))
    # Convert the result to a JSON-friendly format (if needed)
    return [{"query_id": session["query_id"], "conversations": session["conversations"]} for session in last_sessions]