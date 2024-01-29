'use client'
import AddStudent from "@/app/components/AddStudent"
import RemoveStudent from "@/app/components/RemoveStudent"
import DisplayStudent from "@/app/components/DisplayStudent"
import getDocIdFromCollection from "@/app/firebase/firestore/getCollection"
import getDocument from "@/app/firebase/firestore/getData"
import { DocumentSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"

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
        <button onClick={() => {setManageView(!manageView)}}>click here to toggle view</button>
        <h1>This is {groupID}. The teacher id is {teacherID}. The course id is {courseID}.</h1>
        <h1>The course name is {courseName} and all the chapters are {allChapters}</h1>
        {
            
            arrayStudentIDs.map((studentID) => 
                <>
                <DisplayStudent key={studentID} studentID={studentID} courseID={courseID} courseName={courseName} allChapters={allChapters}/>
                {
                    manageView && 
                    <RemoveStudent key={studentID} studentID={studentID} groupID = {groupID}/>
                }    
                </>
            )
        }

        <br/>

        {
            manageView &&
            studentsNotInThisGroup.map((studentID) => 
                <AddStudent key={studentID} studentID={studentID} groupID={groupID} allChapters={allChapters} courseName={courseName}/>
            )
        }
        </>
    )
}