import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

def apply_sql():
    try:
        # Connexion MySQL
        conn = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            user=os.getenv('MYSQL_USER'),
            password=os.getenv('MYSQL_PASSWORD', ''),
            database=os.getenv('MYSQL_DB_NAME')
        )
        cursor = conn.cursor()
        print("Connected to MySQL")

        # Lire le fichier SQL
        with open('setup_dw.sql', 'r', encoding='utf-8') as f:
            sql_file = f.read()

        # Séparer les commandes par ;
        raw_commands = sql_file.split(';')
        
        count = 0
        for raw_cmd in raw_commands:
            # Nettoyer chaque bloc de commande : enlever les commentaires ligne par ligne
            lines = raw_cmd.split('\n')
            clean_lines = [line for line in lines if not line.strip().startswith('--')]
            cmd = '\n'.join(clean_lines).strip()
            
            if cmd:
                try:
                    cursor.execute(cmd)
                    count += 1
                except Exception as e:
                    print(f"Warning on command : {e}")
        
        conn.commit()
        print(f"Success: {count} SQL commands executed.")
        
        cursor.close()
        conn.close()
        print("Database updated.")

    except Exception as e:
        print(f"Error while applying SQL: {e}")

if __name__ == "__main__":
    apply_sql()
