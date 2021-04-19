import { UserData } from "types/auth";

export function saveUserSession(req: any, User: UserData) {
  delete User.password;
  req.session.user = User;
}

export function isAuthenticated(
  req: any,
  res: any,
  allowRoles: Array<number> = []
) {
  if (
    req.session.user &&
    (!allowRoles.length || allowRoles.includes(req.session.user.role))
  ) {
    return true;
  } else {
    res.status(401).send({ error: `User isn't connected` });
    return false;
  }
}
