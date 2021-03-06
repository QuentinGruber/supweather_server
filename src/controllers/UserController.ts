import { UserData } from "../types/auth";
import { ApiResponse } from "../types/shared";
import { Collection, MongoClient } from "mongodb";
const aes256 = require("aes256");
import sanitizeHtml from "sanitize-html";

// MongoDB
const mongoClient = new MongoClient(process.env.MONGODB_URL as string, {
  useUnifiedTopology: true,
  native_parser: true,
});
let collection: Collection<any>;
async function setupMongo() {
  try {
    await mongoClient.connect();
  } catch (e) {
    return e;
  }
  collection = mongoClient.db("supweather").collection("users");
  return true;
}
setupMongo();
function encrypt_password(password: string): string {
  try {
    const newPassword = aes256.encrypt(process.env.ENCRYPTION_KEY, password);
    return newPassword;
  } catch (e) {
    return "";
  }
}

function decrypt_password(password: string): string {
  try {
    return aes256.decrypt(process.env.ENCRYPTION_KEY, password);
  } catch (e) {
    return "";
  }
}

async function knownEmail(userData: UserData): Promise<boolean> {
  const { email } = userData;
  const isUnique: boolean = await collection.findOne({ email: email });
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
  userData.username = sanitizeHtml(userData.username, {
    allowedTags: [],
  }); // to avoid JS server code injection
  const { password, email, username } = userData;
  userData.cities = [];
  userData.isInLightMode = true;
  await collection.insertOne(userData);
  const user = {
    username: username,
    password: password,
    email: email,
    cities:[]
  };
  return { code: 200, data: user };
};

const login = async function (req: any): Promise<ApiResponse> {
  const loginRequest = req.body;
  const { email, password } = loginRequest;
  const user = await collection.findOne({
    email: String(email),
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

const toggleTheme = async function (req: any): Promise<ApiResponse> {
  const { email } = req.session.user;
  const user: UserData = await collection.findOne({
    email: String(email),
  });
  if (user) {
    user.isInLightMode = !user.isInLightMode;
    try {
      await collection.updateOne({ email: user.email }, { $set: user });
      return {
        code: 200,
      };
    } catch (error:any) {
      const { cod, message } = error.response.data;
      return {
        code: cod,
        data: message,
      };
    }
  } else {
    return {
      code: 404,
      data: null,
      error: "Aucun compte n'est associé à cet email",
    };
  }
};

const addCity = async function (req: any): Promise<ApiResponse> {
  const { email } = req.session.user;
  const user: UserData = await collection.findOne({
    email: String(email),
  });
  if (user) {
    user.cities.push(Number(req.body.city));
    req.session.user.cities = user.cities;
    try {
      await collection.updateOne(
        { email: user.email },
        { $set: { cities: user.cities } }
      );
      return {
        code: 200,
      };
    } catch (error:any) {
      const { cod, message } = error.response.data;
      return {
        code: cod,
        data: message,
      };
    }
  } else {
    return {
      code: 404,
      data: null,
      error: "Aucun compte n'est associé à cet email",
    };
  }
};

const removeCity = async function (req: any): Promise<ApiResponse> {
  const { email } = req.session.user;
  const user: UserData = await collection.findOne({
    email: String(email),
  });
  if (user) {
    const cityIndex = user.cities.indexOf(Number(req.body.city));
    if (cityIndex === -1) {
      return {
        code: 404,
        error: "City isn't in user list",
      };
    }
    user.cities.splice(cityIndex, 1);
    req.session.user.cities = user.cities;
    try {
      await collection.updateOne(
        { email: user.email },
        { $set: { cities: user.cities } }
      );
      return {
        code: 200,
      };
    } catch (error:any) {
      const { cod, message } = error.response.data;
      return {
        code: cod,
        data: message,
      };
    }
  } else {
    return {
      code: 404,
      data: null,
      error: "Aucun compte n'est associé à cet email",
    };
  }
};

// only used in tests
const removeUser = async function (req: any): Promise<ApiResponse> {
  const { email } = req.session.user;
  const user: UserData = await collection.findOne({
    email: String(email),
  });
  if (user) {
    try {
      await collection.deleteOne({ email: user.email });
      return {
        code: 200,
      };
    } catch (error:any) {
      const { cod, message } = error.response.data;
      return {
        code: cod,
        data: message,
      };
    }
  } else {
    return {
      code: 404,
      data: null,
      error: "Aucun compte n'est associé à cet email",
    };
  }
};

const getCities = async function (req: any): Promise<ApiResponse> {
  const { email } = req.session.user;
  const user: UserData = await collection.findOne({
    email: String(email),
  });
  if (user) {
    try {
      return {
        code: 200,
        data: user.cities,
      };
    } catch (error:any) {
      const { cod, message } = error.response.data;
      return {
        code: cod,
        data: message,
      };
    }
  } else {
    return {
      code: 404,
      data: null,
      error: "Aucun compte n'est associé à cet email",
    };
  }
};

export {
  encrypt_password,
  decrypt_password,
  setupMongo,
  getCities,
  removeUser,
  register,
  login,
  toggleTheme,
  addCity,
  removeCity,
};
