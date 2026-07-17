from dataclasses import dataclass
from db import RepoTemplate
from system.auth import AuthRepo
from fastapi import APIRouter, Header

@dataclass
class Basket:
    prefix: str
    b_id: int
    description: str | None = ""
    donors: str | None = ""
    winning_ticket: int = 0

class BasketRepo(RepoTemplate):
    def get_all_baskets(self):
        self.cur.execute("SELECT * FROM baskets ORDER BY prefix, b_id")
        results = self.cur.fetchall()
        return [Basket(*r) for r in results]
    def get_prefix_baskets(self, prefix: str):
        self.cur.execute("SELECT * FROM baskets WHERE prefix = ? ORDER BY prefix, b_id", (prefix,))
        results = self.cur.fetchall()
        return [Basket(*r) for r in results]
    def get_single_basket(self, prefix: str, b_id: int):
        self.cur.execute("SELECT * FROM baskets WHERE prefix = ? AND b_id = ? ORDER BY prefix, b_id", (prefix, b_id))
        results = self.cur.fetchall()
        return [Basket(*r) for r in results]
    def get_range_baskets(self, prefix: str, id_from: int, id_to: int):
        self.cur.execute("""SELECT * FROM baskets WHERE prefix = ? AND b_id BETWEEN ? AND ?
            ORDER BY prefix, b_id""", (prefix, id_from, id_to))
        results = self.cur.fetchall()
        return [Basket(*r) for r in results]
    def post_baskets(self, bs: list[Basket]):
        for b in bs:
            self.cur.execute("""INSERT INTO baskets VALUES (?, ?, ?, ?, ?) ON CONFLICT (prefix, b_id) DO UPDATE SET
                description = EXCLUDED.description, donors = EXCLUDED.donors""",
                (b.prefix, b.b_id, b.description, b.donors, b.winning_ticket))
        self.conn.commit()
        return bs

basket_router = APIRouter(prefix="/api/baskets")

@basket_router.get("")
def get_all_baskets(tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return BasketRepo().get_all_baskets()

@basket_router.get("/{prefix}")
def get_prefix_baskets(prefix: str, tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return BasketRepo().get_prefix_baskets(prefix)

@basket_router.get("/{prefix}/{b_id}")
def get_single_basket(prefix: str, b_id: int, tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return BasketRepo().get_single_basket(prefix, b_id)

@basket_router.get("/{prefix}/{id_from}/{id_to}")
def get_range_baskets(prefix: str, id_from: int, id_to: int, tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return BasketRepo().get_range_baskets(prefix, id_from, id_to)

@basket_router.post("")
def post_baskets(bs: list[Basket], tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return BasketRepo().post_baskets(bs)
