'use client'
import signUp from "../firebase/auth/signup";
import { useRouter } from 'next/navigation';
import { useState } from "react";

function Page(): JSX.Element { // funktsioon tagastab react elemendi
  const [ email, setEmail ] = useState( '' );
  const [ password, setPassword ] = useState( '' );
  const router = useRouter();

  // Handle form submission
  const handleForm = async ( event: { preventDefault: () => void } ) => {
    event.preventDefault(); // kui ma õigesti aru saan, siis eventi default on see, et form on tühi. See rida takistab seda jooksutamast niimoodi? correct me if im wrong

    const { result, error } = await signUp( email, password ); // funktisoon signUp (imported failist firebase/auth/signup) tagastab 2 väärtust : result ja error. Juhul kui error ei saa väärtust endale siis jääb unknown. 
    // Signup on lihtalt välja kutsutud signUpWithEmailAndPassword firebase libraryst, millele on lisatud errori kontroll, ehk tagastab 2 väärtust
    
    if ( error ) { // kui error saab väärtuse endale, siis funktsioon sellest if blockist läbi ei saa
      console.log( error );
      return;
    }

    // Kui if blockist saab läbi siis järelikult sign in oli edukas
    router.push( "/admin" );
  }


  

  return (
    <div className="flex justify-center items-center h-screen text-black">
      <div className="w-96 bg-white rounded shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Registration</h1>
        <form onSubmit={handleForm} className="space-y-4">  
        {/* juhul kui vajutatakse nupule, millele on antud type submit siis handle ehk algul kontrolli kas error, kui mitte siis sign up ja viska lehele /admin */}
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              onChange={( e ) => setEmail( e.target.value )}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              onChange={( e ) => setPassword( e.target.value )}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;
