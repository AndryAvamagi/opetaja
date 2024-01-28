import { QuerySnapshot, collection, doc, getDocs, getFirestore, query } from "firebase/firestore";
import firebase_app from "../config";

const db = getFirestore(firebase_app);


export default async function getDocIdFromCollection(col : string){
    let error = null
    let  result= null
    const colRef = collection(db, col)

    try {
        result = await getDocs(colRef)
        
      } catch (e) {
        error = e;
        console.log(error)
      }

    return {result, error};
  }