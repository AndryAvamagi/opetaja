export default function groupPage({params} : any){
    const groupID : string= params.groupID
    console.log(groupID)

    return(
        <h1>This is {groupID}</h1>
    )
}