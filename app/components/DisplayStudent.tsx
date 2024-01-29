import { useState, useEffect } from "react"
import getDocument from "../firebase/firestore/getData"

export default function DisplayStudent(props : any) : JSX.Element{
    const student = props.studentID
    const courseName = props.courseName
    const allChapters = props.allChapters

    const [currChapters, setCurrChapters] = useState<{[key : string] : string}>({})
    const [studentName, setStudentName] = useState<string>('')
    

    useEffect(() => {
        async function getData() : Promise<{ studentName : string, studentCurrChapters : {[key : string] : string}} | null>{
            const fetchDataStudent = await getDocument('students', student)
            
            if(fetchDataStudent.error){
                console.log('there was an error fetching data')
            } else {
                const fetchedDataStudent = fetchDataStudent.result?.data()
                const studentName = fetchedDataStudent?.name
                const studentCurrChapters = fetchedDataStudent?.currChapter

                return {studentName, studentCurrChapters}
            }
            
            return null
        }

        getData().then((result) => {
            if(result){
                setCurrChapters(result.studentCurrChapters)
                setStudentName(result.studentName)

            } else{
                console.log('Error fetching')
            }
        })


    },[])

    const courseLength = allChapters.length
    const currChapter = currChapters[courseName]
    const indexOfCurrChapter = allChapters.indexOf(currChapter)
    const percentOfCourseDone = (indexOfCurrChapter/courseLength)*100



    return(
        <div> <h1>{studentName} and {courseName} and {currChapters[courseName]} and that means that this student has done {percentOfCourseDone}% of the course</h1></div>
       
    )
} 