'use client'
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import  getDocument  from "../firebase/firestore/getData";
import Link from "next/link";

function Page(): JSX.Element {
  // Access the user object from the authentication context
  // const { user } = useAuthContext();
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();
  const [userName, setUserName] = useState<string>('')
  const [userGroups, setUserGroups] = useState<string[]>([])
  



  useEffect( () => {
    if ( user === null ) {
      router.push( "/" );
    }


    async function getData() : Promise<{userName : string, groups : string[]} | null> {
      const fetchData = await getDocument('teachers', user.uid)
      console.log(fetchData)
      
      if (fetchData){
        const fetchedData = fetchData.result?.data()
        const groups = fetchedData?.groups
        const userName = fetchedData?.name
        return {userName, groups}
      } else {
        console.log('error fetching')
        return null
      }
    }
    
    getData()
    .then((result) => {
      if (result) {
        setUserName(result.userName)
        setUserGroups(result.groups)
      } else {
        console.log('Error fetching')
      }
      

    })

  }, [user, router] );
// kuna useEffect laeb iga componendi laadimise korral ühe korra juba, siis  userName ja groups muutumist ei pea jälgima, küll aga võiks jälgida, kui data muutub databases


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
