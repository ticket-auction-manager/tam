from dataclasses import dataclass
from db import RepoTemplate
from .baskets import Basket
from system.auth import AuthRepo
from fastapi import APIRouter, Header

@dataclass
class DrawingLine:
    prefix: str
    b_id: int
    description: str = ""
    winning_ticket: int = 0
    last_name: str = ""
    first_name: str = ""
    phone_number: str = ""

class DrawingRepo(RepoTemplate):
    def get_all_drawing_lines(self):
        self.cur.execute("SELECT * FROM drawing ORDER BY prefix, b_id")
        results = self.cur.fetchall()
        return [DrawingLine(*r) for r in results]
    def get_prefix_drawing_lines(self, prefix: str):
        self.cur.execute("SELECT * FROM drawing WHERE prefix = ? ORDER BY prefix, b_id", (prefix,))
        results = self.cur.fetchall()
        return [DrawingLine(*r) for r in results]
    def get_single_drawing_line(self, prefix: str, b_id: int):
        self.cur.execute("SELECT * FROM drawing WHERE prefix = ? AND b_id = ? ORDER BY prefix, b_id", (prefix, b_id))
        results = self.cur.fetchall()
        return [DrawingLine(*r) for r in results]
    def get_range_drawing_lines(self, prefix: str, id_from: int, id_to: int):
        self.cur.execute("SELECT * FROM drawing WHERE prefix = ? AND b_id BETWEEN ? AND ? ORDER BY prefix, b_id", (prefix, id_from, id_to))
        results = self.cur.fetchall()
        return [DrawingLine(*r) for r in results]
    def post_drawing_lines(self, ds: list[Basket]):
        for d in ds:
            self.cur.execute("""INSERT INTO baskets (prefix, b_id, winning_ticket) VALUES (?, ?, ?) ON CONFLICT (prefix, b_id) DO UPDATE SET
                winning_ticket = EXCLUDED.winning_ticket""", (d.prefix, d.b_id, d.winning_ticket))
        self.conn.commit()
        return ds

drawing_router = APIRouter(prefix="/api/drawing")

@drawing_router.get("")
def get_all_drawing_lines(tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return DrawingRepo().get_all_drawing_lines()

@drawing_router.get("/{prefix}")
def get_prefix_drawing_lines(prefix: str, tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return DrawingRepo().get_prefix_drawing_lines(prefix)

@drawing_router.get("/{prefix}/{b_id}")
def get_single_drawing_line(prefix: str, b_id: int, tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return DrawingRepo().get_single_drawing_line(prefix, b_id)

@drawing_router.get("/{prefix}/{id_from}/{id_to}")
def get_range_drawing_lines(prefix: str, id_from: int, id_to: int, tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return DrawingRepo().get_range_drawing_lines(prefix, id_from, id_to)

@drawing_router.post("")
def post_drawing_lines(ds: list[Basket], tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return DrawingRepo().post_drawing_lines(ds)
