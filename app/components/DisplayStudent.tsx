import { useState } from "react"

export default function DisplayStudent(props : any) : JSX.Element{
    const student = props.studentID
    const course = props.courseID
    const [completedChapters, setCompletedChapters] = useState<string[]>([])
    const [allChapters, setAllChapters] = useState<string[]>([])


    return(
        <div> <h1>{student} and {course}</h1></div>
       
    )
}