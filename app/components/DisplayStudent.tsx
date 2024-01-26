import { useState, useEffect } from "react"
import getDocument from "../firebase/firestore/getData"

export default function DisplayStudent(props : any) : JSX.Element{
    const student = props.studentID
    const course = props.courseID
    const [currChapters, setCurrChapters] = useState<{[key : string] : string}>({})
    const [studentName, setStudentName] = useState<string>('')
    const [allChapters, setAllChapters] = useState<string[]>([])
    const [courseName, setCourseName] = useState<string>('')

    useEffect(() => {
        async function getData() : Promise<{courseName : string, courseChapters : string[], studentName : string, studentCurrChapters : {[key : string] : string}} | null>{
            const fetchDataCourse = await getDocument('courses', course)
            const fetchDataStudent = await getDocument('students', student)
            
            if(fetchDataCourse.error && fetchDataStudent.error){
                console.log('there was an error fetching data')
            } else {
                const fetchedDataCourse = fetchDataCourse.result?.data()
                const fetchedDataStudent = fetchDataStudent.result?.data()
                const courseName = fetchedDataCourse?.name 
                const courseChapters = fetchedDataCourse?.chapters
                const studentName = fetchedDataStudent?.name
                const studentCurrChapters = fetchedDataStudent?.currChapter

                return {courseName, courseChapters, studentName, studentCurrChapters}
            }
            
            return null
        }

        getData().then((result) => {
            if(result){
                setAllChapters(result.courseChapters)
                setCourseName(result.courseName)
                setCurrChapters(result.studentCurrChapters)
                setStudentName(result.studentName)

            } else{
                console.log('Error fetching')
            }
        })


    })

    const courseLength = allChapters.length
    const currChapter = currChapters[courseName]
    const indexOfCurrChapter = allChapters.indexOf(currChapter)
    const percentOfCourseDone = (indexOfCurrChapter/courseLength)*100



    return(
        <div> <h1>{studentName} and {courseName} and {currChapters[courseName]} and that means that this student has done {percentOfCourseDone}% of the course</h1></div>
       
    )
} 