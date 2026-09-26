from dataclasses import dataclass
from db import RepoTemplate
from fastapi import APIRouter, Header, HTTPException, status
import os
import secrets
import string

rdm_str_choice = string.ascii_uppercase + string.digits
tam_pwd = os.getenv("TAM_PWD", "")
if not tam_pwd:
    # No baked-in password: a run without TAM_PWD gets a fresh one, printed
    # once so the operator can pair laptops and manage keys.
    tam_pwd = "".join(secrets.choice(rdm_str_choice) for _ in range(12))
    print(f"TAM_PWD is not set; the password for this run is {tam_pwd}", flush=True)
ex_pwd = HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid Password")
ex_key = HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid Key")

def check_pw(in_pw: str):
    if tam_pwd != in_pw:
        raise ex_pwd

def gen_key():
    return "".join(secrets.choice(rdm_str_choice) for _ in range(32))

@dataclass
class AuthReq:
    description: str = ""

@dataclass
class AuthKey:
    auth_key: str = ""
    description: str = ""

class AuthRepo(RepoTemplate):
    def get_all_keys(self):
        self.cur.execute("SELECT * FROM auth_keys ORDER BY description, auth_key")
        results = self.cur.fetchall()
        return [AuthKey(*r) for r in results]
    def create_key(self, desciption: str = ""):
        while True:
            new_key = gen_key()
            self.cur.execute("SELECT * FROM auth_keys WHERE auth_key = ?", (new_key,))
            results = self.cur.fetchall()
            if len(results) == 0:
                break
        self.cur.execute("INSERT INTO auth_keys VALUES (?, ?) RETURNING *", (new_key, desciption))
        rtn_key = self.cur.fetchone()
        self.conn.commit()
        return AuthKey(*rtn_key)
    def del_key(self, auth_key: str = ""):
        self.cur.execute("DELETE FROM auth_keys WHERE auth_key = ? RETURNING *", (auth_key,))
        results = self.cur.fetchall()
        self.conn.commit()
        if len(results) > 0:
            return AuthKey(*results[0])
        else:
            return AuthKey(auth_key, "")
    def check_key(self, auth_key: str = ""):
        self.cur.execute("SELECT * FROM auth_keys WHERE auth_key = ?", (auth_key,))
        results = self.cur.fetchall()
        if results:
            return True
        else:
            return False
    def verify_key(self, auth_key: str = ""):
        self.cur.execute("SELECT * FROM auth_keys WHERE auth_key = ?", (auth_key,))
        results = self.cur.fetchone()
        if results:
            return True
        else:
            raise ex_key

auth_router = APIRouter(prefix="/api/auth")

@auth_router.get("")
def get_auth_keys(tam_pw: str = Header("")) -> list[AuthKey]:
    check_pw(tam_pw)
    return AuthRepo().get_all_keys()

@auth_router.post("")
def create_auth_key(auth_req: AuthReq, tam_pw: str = Header("")) -> AuthKey:
    check_pw(tam_pw)
    return AuthRepo().create_key(auth_req.description)

@auth_router.delete("")
def delete_auth_key(key_to_del: str, tam_pw: str = Header("")) -> AuthKey:
    check_pw(tam_pw)
    return AuthRepo().del_key(key_to_del)
