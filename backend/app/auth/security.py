from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from datetime import datetime, timezone

# =========================
# CONFIG (MOVE TO ENV IN PRODUCTION)
# =========================
SECRET_KEY = "CHANGE_THIS_TO_A_STRONG_SECRET_KEY"
ALGORITHM = "HS256"

security = HTTPBearer()


# =========================
# CORE TOKEN VALIDATION
# =========================
def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Validates JWT token from:
    Authorization: Bearer <token>
    """

    token = credentials.credentials

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing",
        )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        # Optional expiry check (extra safety layer)
        exp = payload.get("exp")
        if exp:
            if datetime.now(timezone.utc).timestamp() > exp:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token expired",
                )

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication failed",
        )


# =========================
# ROLE-BASED ACCESS CONTROL (RBAC)
# =========================
def require_role(allowed_roles: list[str]):
    """
    Protect routes based on user role.
    Example:
        @router.get("/admin")
        def admin_route(user=Depends(require_role(["admin"]))):
            return user
    """

    def role_checker(user=Depends(verify_token)):

        user_role = user.get("role")

        if not user_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Role not found in token",
            )

        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )

        return user

    return role_checker


# =========================
# SHORTCUT HELPERS (OPTIONAL BUT CLEAN)
# =========================
def require_admin():
    return require_role(["admin"])


def require_hr_or_admin():
    return require_role(["admin", "hr"])


def require_employee():
    return require_role(["employee"])