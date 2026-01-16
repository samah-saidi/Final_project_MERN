import pymongo
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

class DatabaseConnections:
    def __init__(self):
        try:
            # Connexion MongoDB (source)
            self.mongo_client = pymongo.MongoClient(os.getenv('MONGO_URI'))
            self.mongo_db = self.mongo_client[os.getenv('MONGO_DB_NAME')]
            
            # Test de connexion MongoDB
            self.mongo_client.server_info()
            print("✅ MongoDB connecté")
            
            # Connexion MySQL (Data Warehouse)
            self.mysql_conn = mysql.connector.connect(
                host=os.getenv('MYSQL_HOST'),
                port=int(os.getenv('MYSQL_PORT', 3306)),
                user=os.getenv('MYSQL_USER'),
                password=os.getenv('MYSQL_PASSWORD', ''),
                database=os.getenv('MYSQL_DB_NAME')
            )
            self.mysql_cursor = self.mysql_conn.cursor()
            print("✅ MySQL connecté")
            
        except Exception as e:
            print(f"❌ Erreur de connexion: {e}")
            raise
    
    def close_connections(self):
        try:
            self.mongo_client.close()
            self.mysql_cursor.close()
            self.mysql_conn.close()
            print("👋 Connexions fermées")
        except Exception as e:
            print(f"⚠️ Erreur lors de la fermeture: {e}")