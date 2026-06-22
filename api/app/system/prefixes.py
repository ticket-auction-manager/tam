from dataclasses import dataclass
from db import RepoTemplate
from .auth import AuthRepo
from fastapi import APIRouter, Header

@dataclass
class Prefix:
    prefix: str
    color: str = ""
    weight: int = 0

class PrefixRepo(RepoTemplate):
    def get_all_prefixes(self):
        self.cur.execute("SELECT * FROM prefixes ORDER BY weight, prefix")
        results = self.cur.fetchall()
        return [Prefix(*r) for r in results]
    def post_prefixes(self, ps: list[Prefix]):
        for p in ps:
            self.cur.execute("""INSERT INTO prefixes VALUES (?, ?, ?)
                ON CONFLICT (prefix) DO UPDATE SET
                color = EXCLUDED.color, weight = EXCLUDED.weight""", (p.prefix, p.color, p.weight))
        self.conn.commit()
        return ps
    def del_prefix(self, p: str):
        self.cur.execute("DELETE FROM prefixes WHERE prefix = ? RETURNING *", (p,))
        result = self.cur.fetchone()
        self.conn.commit()
        if result:
            return Prefix(*result)
        else:
            return Prefix(p, "gray", 1)

prefix_router = APIRouter(prefix="/api/prefixes")

@prefix_router.get("")
def get_all_prefixes(tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return PrefixRepo().get_all_prefixes()

@prefix_router.post("")
def post_prefixes(ps: list[Prefix], tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return PrefixRepo().post_prefixes(ps)

@prefix_router.delete("")
def delete_prefixes(p: str, tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return PrefixRepo().del_prefix(p)
