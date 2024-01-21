import Link from 'next/link';

export default function Home() {

  return (
    <main className="">
      <div className="">
          <Link href="/signin">
            <span className="link">Login</span>
          </Link>
        </div>

        <div className="">
          <Link href="/signup">
            <span className="link">Register</span>
          </Link>
        </div>
    </main>
  )
}
