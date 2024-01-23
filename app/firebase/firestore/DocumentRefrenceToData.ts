import {getDoc, DocumentReference} from "firebase/firestore";

export default async function DocumentRefrenceToData(docRef : DocumentReference) {
    let result = null;
    let error = null;

    try {
        result = await getDoc(docRef)
    } catch (e) {
        error = e;
    }

    return {result, error}
};