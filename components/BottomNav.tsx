"use client"

import { ContentPaste, People, Person2 } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react";

export default function BottomNav() {
    const [value, setValue] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        let path = pathname.split('/')[1]
        if (path == 'profile') {
            setValue(0)

        } else if (path == 'leagues') {
            setValue(1)

        } else if (path == 'scoreboard') {
            setValue(2)

        }
    }, [pathname])

    return (

        <BottomNavigation

            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
        >

            <BottomNavigationAction label="Profile" icon={<Person2 />} href="/profile" component={Link} />
            <BottomNavigationAction label="Leagues" icon={<People />} href="/leagues" component={Link} />
            <BottomNavigationAction label="Scoreboard" icon={<ContentPaste />} href="/scoreboard" component={Link} />
        </BottomNavigation>
    )
}