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
        <div className="flex items-center justify-between w-full py-2">
            <div className="mx-2 w-24">
                {studentName}
            </div>
            
            <div className="flex flex-col items-center">
                
                <div className="flex items-center w-64 bg-neutral-100 rounded-lg ">
                    <div
                    className="bg-blue-500 z-10 rounded-l-lg"
                    style={{ width: `${percentOfCourseDone}%` }}>
                        <div className="text-[10px] text-center">{percentOfCourseDone}%</div>
                    </div>
                </div>
            </div>
            
        </div>
       
    )
} 