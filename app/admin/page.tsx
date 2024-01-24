'use client'
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import  getDocument  from "../firebase/firestore/getData";
import { DocumentData, DocumentReference, DocumentSnapshot } from "firebase/firestore";
import DocumentReferenceToData from "../firebase/firestore/DocumentRefrenceToData";
import groupButton from "../components/groupButton";
import Link from "next/link";

function Page(): JSX.Element {
  // Access the user object from the authentication context
  // const { user } = useAuthContext();
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null)
  const [userGroups, setUserGroups] = useState<string[]>([])
  



  useEffect( () => {
    if ( user === null ) {
      router.push( "/" );
    }


    async function getData() : Promise<{userName : string, groups : string[]}> {
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
    <>
    <h1>Only logged-in users can view this page. Hello {userName}.</h1>
    <ul>
      {userGroups.map((group) => (
        <li key={group}>
          <Link href={`/admin/${group}`}>{group}</Link>
        </li>
      ))}
    </ul>
    </>
  );
}

export default Page;
