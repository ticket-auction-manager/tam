import os
from pathlib import Path
import sqlite3

tam_data_dir = os.getenv("TAM_DATA_DIR", "./data")

def session():
    data_dir = Path(tam_data_dir)
    if not data_dir.is_dir():
        data_dir.mkdir(parents=True)
    db_file = data_dir / "tam-remote.db"
    conn = sqlite3.connect(db_file)
    cur = conn.cursor()
    return conn, cur

def init_db():
    conn, cur = session()
    cur.execute("CREATE TABLE IF NOT EXISTS auth_keys (auth_key TEXT PRIMARY KEY, description TEXT)")
    cur.execute("CREATE TABLE IF NOT EXISTS prefixes (prefix TEXT PRIMARY KEY, color TEXT, weight INTEGER)")
    conn.commit()
    conn.close()

class RepoTemplate:
    def __init__(self):
        self.conn, self.cur = session()
    def __del__(self):
        self.conn.close()
