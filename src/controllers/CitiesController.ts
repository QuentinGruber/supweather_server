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
    const result:any[] = await collection.find({name : /.*heim.*/,country:"FR"}).toArray();
    const result_filtered = result.filter((element)=>{
      return !req.session.user.cities.includes(element.id)
    }).sort((a:any, b:any) => a.name.localeCompare(b.name))
    return {
      code: 200,
      data: result_filtered,
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
