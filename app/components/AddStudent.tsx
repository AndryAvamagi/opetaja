'use client'
import { useEffect, useState } from "react"
import {addData, updateData}  from "../firebase/firestore/addData"
import { arrayUnion } from "firebase/firestore"
import getDocument from "../firebase/firestore/getData"


export default function AddStudent(props : any) : JSX.Element {
    const studentID : string = props.studentID
    const groupID : string = props.groupID
    const startingChapter : string = props.allChapters[0]
    const courseName : string = props.courseName
    const [studentCurrChapters, setStudentCurrChapters] = useState<{[key : string]:string}>({})

    useEffect(()=>{
        async function getData() {
            const fetchDataStudent = await getDocument('students', studentID)
            if (fetchDataStudent.error) {
                console.log('error fetching student data')
            } else {
                const fetchedDataStudent = fetchDataStudent.result?.data()
                const currChapters = fetchedDataStudent?.currChapter
                return currChapters
            }
            return null
        }

        getData()
        .then((result)=>{
            if (result){
                setStudentCurrChapters(result)
            }
        })
    })

    studentCurrChapters[courseName] = startingChapter


    


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
        <div>
            <h2>{studentID}</h2>
            <button onClick={addStudentToGroup}>click to add</button>
            <br/>
        </div>
    )
}