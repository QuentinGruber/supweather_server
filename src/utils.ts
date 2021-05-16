import { UserData } from "types/auth";

export function saveUserSession(req: any, User: UserData) {
  delete User.password;
  req.session.user = User;
}

export function isAuthenticated(req: any, res: any) {
  if (req.session.user) {
    return true;
  } else {
    res.status(401).send({ error: `User isn't connected` });
    return false;
  }
}
