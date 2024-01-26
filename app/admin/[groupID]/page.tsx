'use client'
import DisplayStudent from "@/app/components/DisplayStudent"
import getDocument from "@/app/firebase/firestore/getData"
import { useEffect, useState } from "react"

export default function GroupPage({params} : any){
    const groupID : string= params.groupID
    const [courseID, setCourseID] = useState<string>('')
    const [teacherID, setTeacherID] = useState<string>('')
    const [arrayStudentIDs, setArrayStudentIDs] = useState<string[]>([])

    useEffect(() => {
        async function getData() : Promise<{teacher : string, course : string, students : string[]} | null>{
            const fetchData = await getDocument('groups', groupID)
            
            if(fetchData.error){
                console.log('there was an error fetching data')
            } else {
                const fetchedData = fetchData.result?.data()
                const teacher = fetchedData?.teacher
                const course = fetchedData?.course
                const students = fetchedData?.students

                return {teacher, course, students}
            }
            
            return null
        }

        getData().then((result) => {
            if(result){
                setCourseID(result.course)
                setTeacherID(result.teacher)
                setArrayStudentIDs(result.students)

            } else{
                console.log('Error fetching')
            }
        })

    })

    return(
        <>
        <h1>This is {groupID}. The teacher id is {teacherID}. The course id is {courseID}. The students are {arrayStudentIDs}</h1>
        {arrayStudentIDs.map((student) => (
          <DisplayStudent key={student} studentID={student} courseID={courseID}/>
      ))}
        </>
    )
}