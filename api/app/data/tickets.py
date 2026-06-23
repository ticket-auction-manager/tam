from dataclasses import dataclass
from db import RepoTemplate
from system.auth import AuthRepo
from fastapi import APIRouter, Header

@dataclass
class Ticket:
    prefix: str
    t_id: int
    first_name: str = ""
    last_name: str = ""
    phone_number: str = ""
    pref: str = ""

class TicketRepo(RepoTemplate):
    def get_all_tickets(self):
        self.cur.execute("SELECT * FROM tickets ORDER BY prefix, t_id")
        results = self.cur.fetchall()
        return [Ticket(*r) for r in results]
    def get_prefix_tickets(self, prefix: str):
        self.cur.execute("SELECT * FROM tickets WHERE prefix = ? ORDER BY prefix, t_id", (prefix,))
        results = self.cur.fetchall()
        return [Ticket(*r) for r in results]
    def get_single_ticket(self, prefix: str, id: int):
        self.cur.execute("SELECT * FROM tickets WHERE prefix = ? AND t_id = ? ORDER BY prefix, t_id", (prefix, id))
        results = self.cur.fetchall()
        return [Ticket(*r) for r in results]
    def get_range_tickets(self, prefix: str, id_from: int, id_to: int):
        self.cur.execute("SELECT * FROM tickets WHERE prefix = ? AND t_id BETWEEN ? AND ? ORDER BY prefix, t_id", (prefix, id_from, id_to))
        results = self.cur.fetchall()
        return [Ticket(*r) for r in results]
    def post_tickets(self, ts: list[Ticket]):
        for t in ts:
            self.cur.execute("""INSERT INTO tickets VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (prefix, t_id) DO UPDATE SET
                first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, phone_number = EXCLUDED.phone_number,
                pref = EXCLUDED.pref""", (t.prefix, t.t_id, t.first_name, t.last_name, t.phone_number, t.pref))
        self.conn.commit()
        return ts

tickets_router = APIRouter(prefix="/api/tickets")

@tickets_router.get("")
def get_all_tickets(tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return TicketRepo().get_all_tickets()

@tickets_router.get("/{prefix}")
def get_prefix_tickets(prefix: str, tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return TicketRepo().get_prefix_tickets(prefix)

@tickets_router.get("/{prefix}/{t_id}")
def get_single_ticket(prefix: str, t_id: int, tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return TicketRepo().get_single_ticket(prefix, t_id)

@tickets_router.get("/{prefix}/{id_from}/{id_to}")
def get_range_tickets(prefix: str, id_from: int, id_to: int, tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return TicketRepo().get_range_tickets(prefix, id_from, id_to)

@tickets_router.post("")
def post_tickets(ts: list[Ticket], tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return TicketRepo().post_tickets(ts)
