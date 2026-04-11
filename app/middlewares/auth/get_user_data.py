from fastapi import HTTPException, Request
import jwt

from app.env_vars import JWT_SECRET


def get_user_data(req: Request):
    try:
        token = req.headers.get("Authorization")
        if not token:
            raise HTTPException(401, {"message": "Not authorized"})

        if token.startswith("Bearer"):
            token = token.split(" ")[1].strip()

        decoded = jwt.decode(token, key=JWT_SECRET, algorithms=["HS256"])

        user_id = decoded.get("user_id")
        username = decoded.get("username")

        if not user_id and not username:
            raise HTTPException(401, {"message": "Invalid token"})


        req.state.user_id = str(user_id) + "__"
        req.state.username = str(username)

        return req
    
    except Exception as e:
        raise HTTPException(500, {"message": "Internal server error", "error": str(e)})