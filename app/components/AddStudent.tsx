
import { useEffect, useState } from "react"
import {addData, updateData}  from "../firebase/firestore/addData"
import { arrayUnion } from "firebase/firestore"
import getDocument from "../firebase/firestore/getData"


export default function AddStudent(props : any) : JSX.Element {
    const studentID : string = props.studentID
    const groupID : string = props.groupID
    const allChapters : string[] = props.allChapters
    const startingChapter : string = allChapters[0]
    const courseName : string = props.courseName

    const [studentName, setStudentName] = useState<string>('')
    const [studentCurrChapters, setStudentCurrChapters] = useState<{[key : string]:string}>({})

    useEffect(()=>{
        async function getData() {
            const fetchDataStudent = await getDocument('students', studentID)
            
            if (fetchDataStudent.error) {
                console.log('error fetching student data')
            } else {
                const fetchedDataStudent = fetchDataStudent.result?.data()
                const studentName = fetchedDataStudent?.name
                const currChapters = fetchedDataStudent?.currChapter
                return {studentName, currChapters}
            }
            return null
        }

        getData()
        .then((result)=>{
            if (result){
                setStudentName(result.studentName)
                setStudentCurrChapters(result.currChapters)
            }
        })
    })


    // kui opilane pole veel kursusega kunagi pihta hakanud, ehk kursust pole tema currChapteris siis maara currChapteris kursuse vastele esimene peatukk
    if (allChapters.indexOf(studentCurrChapters[courseName]) === -1){
        studentCurrChapters[courseName] = startingChapter
    }
    


    async function addStudentToGroup(event: { preventDefault: () => void }) {
        event.preventDefault()

        
        
        await updateData('groups', groupID, {
            students : arrayUnion(studentID)
        })

        await updateData('students', studentID, {
            groups : arrayUnion(groupID)
        })

        await updateData('students', studentID, {
            currChapter : studentCurrChapters
        })

        window.location.reload();
    }

    return(
        <div className="flex items-center">
            <div className="w-16 mx-2">{studentName}</div>
            <button onClick={addStudentToGroup} className="rounded-lg bg-green-500 text-white w-6 m-2 hover:bg-green-600">+</button>
            <br/>
        </div>
    )
}