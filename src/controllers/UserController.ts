import { UserData } from "../types/auth";
import { ApiResponse } from "../types/shared";
import {Collection, MongoClient} from "mongodb";


// MongoDB
const mongoClient = new MongoClient(
  process.env.MONGODB_URL as string,
  {
    useUnifiedTopology: true,
    native_parser: true,
  }
);
let collection:Collection<any> ;
async function setupMongo(){
  await mongoClient.connect()
  collection = mongoClient.db("testmern").collection("users");
}
setupMongo();
function encrypt_password(password: string): string {
  try {
    const newPassword = password;
    return newPassword;
  } catch (e) {
    return "";
  }
}

function decrypt_password(password: string): string {
  try {
    return password;
  } catch (e) {
    return "";
  }
}

async function knownEmail(userData: UserData): Promise<boolean> {
  const { email } = userData;
  const isUnique: boolean = await collection.findOne({email:email});
  return isUnique;
}

const register = async function (req: any): Promise<ApiResponse> {
  const userData: UserData = req.body;

  if (await knownEmail(userData))
    return { code: 406, error: "Cet email est déjà utilisé" };
  if (userData.password) {
    userData.password = encrypt_password(userData.password);
    if (userData.password === "")
      throw console.error("failed to encrypt password");
  } else if (!userData.password) {
    return { code: 406, error: "Le mot de passe n'est pas défini" };
  }
  const { password, email, username } = userData;
  userData.cities = []
  userData.isInLightMode = true;
  const result = await collection.insertOne(userData) 
  const user = {
    username: username,
    password: password,
    email: email
  };
  return { code: 200, data: user };
};

const login = async function (req: any): Promise<ApiResponse> {
  const loginRequest = req.body;
  const { email, password } = loginRequest;
  const user = await collection.findOne({
     email: String(email) 
  });
  if (user) {
    const { password: storedPassword } = user;
    const passwordMatch = decrypt_password(storedPassword) === password;
    return {
      code: passwordMatch ? 200 : 406,
      data: passwordMatch ? user : null,
      error: passwordMatch ? null : "Mot de passe incorrect",
    };
  } else {
    return {
      code: 404,
      data: null,
      error: "Aucun compte n'est associé à cet email",
    };
  }
};
export { register, login };
