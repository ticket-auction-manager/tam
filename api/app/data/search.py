from fastapi import APIRouter, Header
from .tickets import Ticket
from db import RepoTemplate
from system.auth import AuthRepo

chunk_size = 300

def wild_enc(str_in: str):
    return f"%{str_in}%"

class SearchRepo(RepoTemplate):
    def ticket_search(self, first_name: str, last_name: str, phone_number: str):
        self.cur.execute("SELECT * FROM tickets WHERE first_name LIKE ? AND last_name LIKE ? AND phone_number LIKE ? ORDER BY prefix, t_id", (wild_enc(first_name), wild_enc(last_name), wild_enc(phone_number)))
        results = self.cur.fetchall()
        return [Ticket(*r) for r in results]
    def post_tickets(self, ts: list[Ticket]):
        for i in range(0, len(ts), chunk_size):
            chunk = ts[i:i+chunk_size]
            for t in chunk:
                self.cur.execute("""INSERT INTO tickets VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (prefix, t_id)
                    DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name,
                    phone_number = EXCLUDED.phone_number, pref = EXCLUDED.pref""",
                    (t.prefix, t.t_id, t.first_name, t.last_name, t.phone_number, t.pref))
            self.conn.commit()
        return ts

search_router = APIRouter(prefix="/api/search")

@search_router.get("/tickets")
def search_tickets(first_name: str = "", last_name: str = "", phone_number: str = "", tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return SearchRepo().ticket_search(first_name, last_name, phone_number)

@search_router.post("/tickets")
def post_tickets(ts: list[Ticket], tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return SearchRepo().post_tickets(ts)
