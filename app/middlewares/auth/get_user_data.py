from fastapi import HTTPException, Request


def get_user_data(req: Request):
    user_id = req.headers.get("Authorization")
    if not user_id:
        raise HTTPException(401, {"message": "Access denied"})

    if user_id.startswith("Bearer"):
        user_id = user_id.split(" ")[1].strip()

    req.state.user_id = user_id
    return req