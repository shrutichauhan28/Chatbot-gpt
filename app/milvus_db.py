from pymilvus import connections, utility

# Connect to Milvus
connections.connect("default", host="localhost", port="19530")

# # Create a new user #(uncomment if you need to create a user)
# utility.create_user(user="admin", password="2811shruti", using="default")

# Grant all permissions to the user on the default database
# Uncomment the next line if you need to grant permissions
# connections.grant_privilege(user="admin", db_name="default", privilege="ALL")

# List all collections
collections = utility.list_collections()
print("Collections in Milvus:")
for collection in collections:
    print(collection)
