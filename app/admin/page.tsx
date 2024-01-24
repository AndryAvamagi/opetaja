'use client'
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import  getDocument  from "../firebase/firestore/getData";
import { DocumentData, DocumentReference, DocumentSnapshot } from "firebase/firestore";
import DocumentReferenceToData from "../firebase/firestore/DocumentRefrenceToData";

function Page(): JSX.Element {
  // Access the user object from the authentication context
  // const { user } = useAuthContext();
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();
  const [userName, setUserName] = useState<String | null>(null)
  const [userGroups, setUserGroups] = useState<String[]>([])
  const [userGroupIDs, setUserGroupIDs] = useState<{[key:string]:DocumentReference}>({})



  useEffect( () => {
    if ( user === null ) {
      router.push( "/" );
    }


    async function getData() : Promise<{userName : String, groups : String[]}> {
      const fetchData = await getDocument('teachers', user.uid)
      const fetchedData = fetchData.result?.data()
      const groups = fetchedData?.groups
      const userName = fetchedData?.name

      return {userName, groups}
    }
    
    getData().then(({userName, groups}) => {
      if (userName){
        setUserName(userName)
      }

      if (groups) {
        setUserGroups(groups)
      }
      

    })

  }, [user, router] );
// kuna useEffect laeb iga componendi laadimise korral ühe korra juba, siis  userName ja groups muutumist ei pea jälgima

  return ( 
    <h1>Only logged-in users can view this page. Hello {userName}. {userGroups[0]}</h1>
  );
}

export default Page;
