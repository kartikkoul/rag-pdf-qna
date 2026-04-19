from fastapi import HTTPException, Request
from requests import api

from app.env_vars import NEXTJS_SERVER_URL


def get_user_data(req: Request):    
    try:
        res = api.get(f"{NEXTJS_SERVER_URL}/v1/auth/getuser", headers={"Authorization": req.headers.get("Authorization")})
        data = res.json()
        
        if res.status_code != 200:
            raise HTTPException(res.status_code, {"message": data.get("message") or data.get("error"), "type":"auth_error"})
        

        user_id = data.get("userId")
        username = data.get("username")

        if not user_id and not username:
            raise HTTPException(401, {"message": "Invalid token","type":"auth_error"})


        req.state.user_id = str(user_id) + "__"
        req.state.username = str(username)
        

        return req
    
    except Exception as e:
        print("Error in get_user_data: ", str(e))
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(500, {"message": "Internal server error", "error": str(e)})