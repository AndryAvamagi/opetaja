import Link from 'next/link';

export default function groupButton({params} : any){
    const group = params.target
    return(
        <Link href={`/admin/${group}`}>
            <div>
                Button for {group}
            </div>
        </Link>
    )
}