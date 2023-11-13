"use client"
import { use, useState } from "react";
import { getUser } from "@/lib/data"
import supabase from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { redirect } from "next/navigation"
import { Button } from "@mui/material";
export default function Profile() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => {
        setOpen(true);
    };
    // const router = useRouter()

    //     const { data: { user } } =  await getUser()

    // console.log(user)

    let user = getUser()
    console.log(user)
    return (
        <div>
            <div className="flex justify-center mt-6">

                <Button variant="outlined" onClick={handleClickOpen}>Create a Player Profile</Button>

            </div>
        </div>
    )
}
