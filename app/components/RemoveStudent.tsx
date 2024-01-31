import { arrayRemove } from "firebase/firestore"
import { updateData } from "../firebase/firestore/addData"

export default function RemoveStudent(props : any) : JSX.Element {
    const studentID = props.studentID
    const groupID = props.groupID
     

    async function removeStudentFromGroup(event: { preventDefault: () => void }) {
        event.preventDefault()

        
        
        await updateData('groups', groupID, {
            students : arrayRemove(studentID)
        })

        await updateData('students', studentID, {
            groups : arrayRemove(groupID)
        })


        window.location.reload();
    }

    return(
        <div>
            <button onClick={removeStudentFromGroup} className="rounded-lg bg-red-500 text-white w-6 mx-2 hover:bg-red-600">-</button>
            <br/>
        </div>
    )
}