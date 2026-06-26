from dataclasses import dataclass
from db import RepoTemplate
from system.auth import AuthRepo
from fastapi import APIRouter, Header

@dataclass
class ReportByNameLine:
    last_name: str = ""
    first_name: str = ""
    phone_number: str = ""
    pref: str = ""
    prefix: str = ""
    b_id: int = 0
    description: str = ""
    donors: str = ""
    winning_ticket: int = 0

@dataclass
class ReportByBasketLine:
    prefix: str = ""
    b_id: int = 0
    description: str = ""
    donors: str = ""
    winning_ticket: int = 0
    last_name: str = ""
    first_name: str = ""
    phone_number: str = ""
    pref: str = ""

class ReportsRepo(RepoTemplate):
    def get_by_name_report(self, prefix: str):
        self.cur.execute("SELECT * FROM report_by_name WHERE prefix = ?", (prefix,))
        results = self.cur.fetchall()
        return [ReportByNameLine(*r) for r in results]
    def get_by_basket_report(self, prefix: str):
        self.cur.execute("SELECT * FROM report_by_basket WHERE prefix = ?", (prefix,))
        results = self.cur.fetchall()
        return [ReportByBasketLine(*r) for r in results]

reports_router = APIRouter(prefix="/api/reports")

@reports_router.get("/byname/{prefix}")
def get_report_by_name(prefix: str, tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return ReportsRepo().get_by_name_report(prefix)

@reports_router.get("/bybasket/{prefix}")
def get_report_by_basket(prefix: str, tam_key: str = Header("")):
    AuthRepo().verify_key(tam_key)
    return ReportsRepo().get_by_basket_report(prefix)
