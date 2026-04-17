import { redirect } from "next/navigation";
import HomePage from "../components/Home/HomePage";
import { getUser } from "../utils/auth";
import { AuthData } from "../types/types";

export default async function Home() {
  const authData = await getUser() as AuthData;

  if(!authData){
    redirect("/auth/signin");
  }


  return <HomePage authData={authData}/>
}
