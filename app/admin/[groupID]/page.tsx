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
    const [courseID, setCourseID] = useState<string>('')
    const [teacherID, setTeacherID] = useState<string>('')
    const [arrayStudentIDs, setArrayStudentIDs] = useState<string[]>([])

    const [allStudents, setAllStudents] = useState<string[]>([])


    const [allChapters, setAllChapters] = useState<string[]>([])
    const [courseName, setCourseName] = useState<string>('')

    useEffect(() => {
        async function getData() : Promise<{teacher : string, course : string, students : string[], allStudents : string[]} | null>{
            const fetchDataGroups = await getDocument('groups', groupID)
            
            const fetchDataAllStudents = await getDocIdFromCollection('students')
            
            
            if(fetchDataGroups.error /*|| fetchDataAllStudents.error*/){
                console.log('there was an error fetching data')
            } else {
                const fetchedData = fetchDataGroups.result?.data()
                const fetchedDataAllStudents = fetchDataAllStudents.result?.docs
                
                
                let allStudents : string[] = []
                
                if (fetchedDataAllStudents){
                    let doc : DocumentSnapshot
                    for (doc of fetchedDataAllStudents){
                        allStudents.push(doc.id)
                    }
                }
                

                const teacher = fetchedData?.teacher
                const course = fetchedData?.course
                const students : string[] = fetchedData?.students

                console.log(students)

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

    let studentsNotInThisGroup : string[] = []
    allStudents.forEach(element => {
        if(arrayStudentIDs.indexOf(element) === -1){
            studentsNotInThisGroup.push(element)
        }
        
    });

    return(
        <>
        <h1>This is {groupID}. The teacher id is {teacherID}. The course id is {courseID}.</h1>
        <h1>The course name is {courseName} and all the chapters are {allChapters}</h1>
        {
            
            arrayStudentIDs.map((studentID) => 
                <>
                <DisplayStudent key={studentID} studentID={studentID} courseID={courseID}/>
                <RemoveStudent key={studentID} studentID={studentID} groupID = {groupID}/>
                </>
            )
        }

        <br/>

        {
            studentsNotInThisGroup.map((studentID) => 
                <AddStudent key={studentID} studentID={studentID} groupID={groupID} allChapters={allChapters} courseName={courseName}/>
            )
        }
        </>
    )
}