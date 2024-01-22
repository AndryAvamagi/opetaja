'use client'
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import  getDocument  from "../firebase/firestore/getData";
import { DocumentData } from "firebase/firestore";

function Page(): JSX.Element {
  // Access the user object from the authentication context
  // const { user } = useAuthContext();
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
  const router = useRouter();
  const [userData, setUserData] = useState<DocumentData | null>(null)

  useEffect( () => {
    if ( user == null ) {
      router.push( "/" );
    }

    async function getData() {
      const fetchData = await getDocument('teachers', user.uid)

      const fetchedData = fetchData.result?.data()

      if (fetchedData){
        setUserData(fetchedData)
      }
    }
    getData()

  }, [ user, router] ); //router eemaldab eslinti errori


  

  return (
    <h1>Only logged-in users can view this page. Hello {userData?.name}</h1>
  );
}

export default Page;
