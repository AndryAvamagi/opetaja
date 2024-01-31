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


  //dummy cases
  function dummyCases(number : number) {
    let tempArray : JSX.Element[]= []
    for (let index = 0; index < number; index++) {
      tempArray.push(<div className="flex justify-center items-center w-1/6  mx-[20.5px] mt-5 aspect-video shadow-lg hover:scale-95"> test case</div>)
      
    }
    return(tempArray)
  }
  

  return ( 
    <>
    <div className="flex flex-col justify-center items-center w-full text-black font-bold text-4xl uppercase mt-10">
      <h1>hello <span className="text-blue-600">{userName}</span></h1>
      <h1 className="text-lg">please choose your group</h1>
    </div>
    <div className="flex flex-wrap m-2 pb-5 shadow-lg justify-start ">
      {userGroups.map((group) => (
            
          <Link key={group} href={`/admin/${group}`} className="flex justify-center items-center w-1/6  mx-[20.5px] mt-5 aspect-video shadow-lg hover:scale-95">
            <h1 className="text-lg font-bold mb-6 text-blue-600 uppercase">{group}</h1>
          </Link>
            
      ))
      }

      
      {dummyCases(10)}
    </div>

    
    </>
  );
}

export default Page;
