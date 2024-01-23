'use client'
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import  getDocument  from "../firebase/firestore/getData";
import { DocumentData, DocumentReference, DocumentSnapshot } from "firebase/firestore";
import DocumentRefrenceToData from "../firebase/firestore/DocumentRefrenceToData";

function Page(): JSX.Element {
  // Access the user object from the authentication context
  // const { user } = useAuthContext();
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();
  const [userName, setUserName] = useState<String | null>(null)
  const [userGroups, setUserGroups] = useState<String[]>([])
  const [loading, setLoading] = useState(true);



  useEffect( () => {
    if ( user == null ) {
      router.push( "/" );
    }

    async function getData() {
      const fetchData = await getDocument('teachers', user.uid)
      const fetchedData = fetchData.result?.data()
      const groups = fetchedData?.groups
      const userName = fetchedData?.name

      const groupsDocumentData : String[] = [];
      groups.forEach( async (docRef : DocumentReference) => {
        const docData = await DocumentRefrenceToData(docRef)
        const docDataResult = docData.result

        if(docDataResult){
          groupsDocumentData.push(docDataResult.id)
        }

      });

      

      if (fetchedData) {
        setUserName(userName)
        setUserGroups(groupsDocumentData)
        console.log('The variable userGroups is ')
        console.log(userGroups)
        console.log(',.....')
        console.log('the variable for groupsDocumentData is...')
        setLoading(false);
      }
    }
    getData()

  }, [user] );

  
  if (loading) {
    return (
      <h1>waiting for groups...</h1>
    )
  } 
  
  console.log(userGroups)

  return ( 
    <h1>Only logged-in users can view this page. Hello {userName}. Groups {userGroups[0]}</h1>
  );
}

export default Page;
