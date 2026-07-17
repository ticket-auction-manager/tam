from data.baskets import Basket, BasketRepo
from data.tickets import Ticket, TicketRepo
from .prefixes import Prefix, PrefixRepo
from dataclasses import dataclass, field
from typing import List
from fastapi import APIRouter, Header
from .auth import AuthRepo

chunk_size = 300

@dataclass
class BackupFile:
  prefixes: List[Prefix] = field(default_factory=list)
  baskets: List[Basket] = field(default_factory=list)
  tickets: List[Ticket] = field(default_factory=list)

@dataclass
class ReturnMessage:
  message: str

backuprestore_router = APIRouter(prefix="/api/backuprestore")

@backuprestore_router.get("")
def get_backup_file(tam_key: str = Header("")):
  AuthRepo().verify_key(tam_key)
  return BackupFile(prefixes=PrefixRepo().get_all_prefixes(), baskets=BasketRepo().get_all_baskets(), tickets=TicketRepo().get_all_tickets())

@backuprestore_router.post("")
def post_backup_file(bf: BackupFile, tam_key: str = Header("")):
  AuthRepo().verify_key(tam_key)
  for i in range(0, len(bf.prefixes), chunk_size):
    PrefixRepo().post_prefixes(bf.prefixes[i:i+chunk_size])
  for i in range(0, len(bf.baskets), chunk_size):
    BasketRepo().post_baskets(bf.baskets[i:i+chunk_size])
  for i in range(0, len(bf.tickets), chunk_size):
    TicketRepo().post_tickets(bf.tickets[i:i+chunk_size])
  return ReturnMessage(message="Backup file imported successfully.")
