"use client"
import { use } from "react";
import { getUser, verfifyUser } from "@/lib/data"
import supabase from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { redirect } from "next/navigation"
export default function Connect() {

    // verfifyUser(token)
    // const router = useRouter()

    //     const { data: { user } } =  await getUser()

    // console.log(user)

    let user = getUser()
    console.log(user)
    return (
        <div>check your email to confirm</div>
    )
}
