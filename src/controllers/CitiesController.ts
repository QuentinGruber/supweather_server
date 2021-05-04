import { ApiResponse } from "../types/shared";
import {Collection, MongoClient} from "mongodb";

const mongoClient = new MongoClient(
  process.env.MONGODB_URL as string,
  {
    useUnifiedTopology: true,
    native_parser: true,
  }
);
let collection:Collection<any> 
async function setupMongo(){
  try{
  await mongoClient.connect()
  }
  catch(e){
    return e
  }
  collection = mongoClient.db("testmern").collection("cities");
  return true
}
setupMongo();

const GetCitieslist = async function (req: any): Promise<ApiResponse> {
  const {countryCode} = req.query
  if(countryCode){
  try {
    const result = await collection.find({
      'country': 'FR'
    }).toArray();
    return {
      code: 200,
      data: result,
    };
  } catch (error) {
    console.log(error.response)
    const { cod , message } = error.response.data
    return {
      code: cod,
      data: message,
    };
  }
  }else{
    return {
      code : 406,
      data: "missing countryCode in query"
    }
  }
};

export { GetCitieslist };
