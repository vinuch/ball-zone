"use client"

import { ContentPaste, People, Person2 } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

export default function BottomNav () {
    const [value, setValue] = useState(0);

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