'use client'
import { redirect } from "next/navigation"


export default  function Home() {

  redirect('/sign-in')


  return (
    <>
    <h1>Homepage</h1>
    </>
  )
}
