from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from datetime import datetime, timezone

SECRET_KEY = "CHANGE_THIS_TO_A_STRONG_SECRET_KEY"
ALGORITHM = "HS256"

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # expiry check
        exp = payload.get("exp")
        if exp and datetime.now(timezone.utc).timestamp() > exp:
            raise HTTPException(status_code=401, detail="Token expired")

        return payload

    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ROLE GUARD
def require_role(allowed_roles: list[str]):
    def wrapper(user=Depends(get_current_user)):
        role = user.get("role")

        if role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )

        return user

    return wrapper


# SHORTCUTS
def require_admin():
    return require_role(["admin"])

def require_hr():
    return require_role(["admin", "hr"])

def require_employee():
    return require_role(["employee"])