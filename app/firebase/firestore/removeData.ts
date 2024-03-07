import firebase_app from "../config";
import { getFirestore, updateDoc, doc} from "firebase/firestore"

const db = getFirestore(firebase_app)

export default async function removeData(
    collection : string, 
    id : string,
    data : any
) {
    let result = null;
    let error = null;

  try {
    result = await updateDoc(doc(db, collection, id), data)
  } catch (e) {
    error = e;
  }

  return { result, error };
}