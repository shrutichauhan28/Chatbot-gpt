from pymilvus import connections, utility

# Connect to Milvus
connections.connect("default", host="localhost", port="19530")

# Create a new user
utility.create_user(user="admin", password="2811shruti", using="default")

# Grant all permissions to the user on the default database
connections.grant_privilege(user="admin", db_name="default", privilege="ALL")
