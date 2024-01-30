'use client'
import AddStudent from "@/app/components/AddStudent"
import RemoveStudent from "@/app/components/RemoveStudent"
import DisplayStudent from "@/app/components/DisplayStudent"
import getDocIdFromCollection from "@/app/firebase/firestore/getCollection"
import getDocument from "@/app/firebase/firestore/getData"
import { DocumentSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import classNames from "classnames"

export default function GroupPage({params} : any){
    const groupID : string= params.groupID
    
    //group id fetch
    const [courseID, setCourseID] = useState<string>('')
    const [teacherID, setTeacherID] = useState<string>('')
    const [arrayStudentIDs, setArrayStudentIDs] = useState<string[]>([]) //only group students


    //collectionist all student id
    const [allStudents, setAllStudents] = useState<string[]>([])

    //course id -> all chapters of that course, course name and 
    const [allChapters, setAllChapters] = useState<string[]>([])
    const [courseName, setCourseName] = useState<string>('')

    //manage view enabled or disabled, by default disabled, aga votab localstoragest selle peamiselt, peab midagi paremat valja motlema
    const [manageView, setManageView] = useState<boolean>(false)


    useEffect(() => {
        const cur = JSON.parse(window.localStorage.getItem('manageView') || 'null') //votab manageView vaartuse localStoragest
        if(cur){
            setManageView(cur)
        }
        

        async function getData() : Promise<{teacher : string, course : string, students : string[], allStudents : string[]} | null>{
            const fetchDataGroups = await getDocument('groups', groupID)
            const fetchDataAllStudents = await getDocIdFromCollection('students')
            
            
            if(fetchDataGroups.error || fetchDataAllStudents.error){
                console.log('there was an error fetching data')
            } else {
                const fetchedData = fetchDataGroups.result?.data()
                const fetchedDataAllStudents = fetchDataAllStudents.result?.docs
                
                //loopin labi fetchedDataAllStudents, et saada array koikidest opilastest
                let allStudents : string[] = []
                if (fetchedDataAllStudents){
                    let doc : DocumentSnapshot
                    for (doc of fetchedDataAllStudents){
                        allStudents.push(doc.id)
                    }
                }
                

                const teacher = fetchedData?.teacher
                const course = fetchedData?.course
                const students = fetchedData?.students

                return {teacher, course, students, allStudents}
            }
            
            return null
        }

        getData()
        .then((result) => {
            if(result){
                setCourseID(result.course)
                setTeacherID(result.teacher)
                setArrayStudentIDs(result.students)
                setAllStudents(result.allStudents)

                return result.course
            } else{
                console.log('Error fetching this dsasdasd')
            }
        })
        .then( async (courseID)=>{
            const fetchDataCourses = await getDocument('courses', courseID)
            
            if(fetchDataCourses.error){
                console.log('error fetching course')
            } else {
                const fetchedDataCourses = fetchDataCourses.result?.data()
                const courseName = fetchedDataCourses?.name 
                const allChapters = fetchedDataCourses?.chapters
                return {courseName, allChapters}
            }
            return null
        })
        .then((result) => {
            setAllChapters(result?.allChapters)
            setCourseName(result?.courseName)
        })

    }, [])


    // siin ma loopin labi koik studentid ja lisan uute arraysse ainult need, kes ei ole antud grupis
    let studentsNotInThisGroup : string[] = []
    allStudents.forEach(element => {
        if(arrayStudentIDs.indexOf(element) === -1){
            studentsNotInThisGroup.push(element)
        }
        
    });

    
    useEffect(() => { //kui kutsutakse valja buttoniga setManageView, siis muutub manageView vastupidiseks ja kuna see muutub, siis see useEffect laheb toole ja muudab localstorages info
        window.localStorage.setItem('manageView', JSON.stringify(manageView));
      }, [manageView]);



    

    return(
        <>
        
        <div className="flex justify-self-center items-center flex-col">
            <h1>This is {groupID}.</h1>
            <h1>The course name is {courseName}</h1>
        </div>

        <div className="m-5 shadow border-2 min-h-screen"> 
        {/* ainuke põhjus, miks ma min heighti määrasin on see, et kui manageView enableda siis läheb lehekülg instant pikkemaks ning tekib scrollwheel, mis liigutas kõik parempoolsed elemendid veits vasakule, kaasaarvatud toggle, mis tõsiselt häiris mind */}

            <div className="flex justify-between">
                
                <div className="flex-col border-2">    
                    {
                        arrayStudentIDs.map((studentID) => 

                        <div key={studentID} className="flex items-center border-2">
                            
                            <DisplayStudent key={studentID} studentID={studentID} courseID={courseID} courseName={courseName} allChapters={allChapters}/>
                            {
                                manageView && 
                                <RemoveStudent key={studentID} studentID={studentID} groupID = {groupID}/>
                            }    
                            
                        </div>
                        )
                    }

                    <br/>

                    {
                        manageView &&
                        studentsNotInThisGroup.map((studentID) => 
                            <AddStudent key={studentID} studentID={studentID} groupID={groupID} allChapters={allChapters} courseName={courseName}/>
                        )
                    }
                </div>

                <div 
                onClick={() => {setManageView(!manageView)}}
                className={classNames("flex w-10 h-5 m-5 bg-gray-400 rounded-full transition-all duration-800", {
                    'bg-green-600' : manageView
                })}
                >
                    <span className={classNames('w-5 h-5 bg-white shadow rounded-full transition-all duration-800', {
                        'ml-5' : manageView
                    })}></span>
                </div>
                {/* <div className="flex justify-end items-start self-start border-2 bg-blue-500 text-white font-semibold p-2 rounded">
                    <button onClick={() => {setManageView(!manageView)}}>button</button>
                </div> */}
            </div>
        </div>


        


       
        </>
    )
}