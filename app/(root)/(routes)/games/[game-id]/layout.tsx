"use client"
import Link from 'next/link'
import * as React from 'react';
import Box from '@mui/material/Box';

import { Paper } from '@mui/material';
import { Logout, Notifications, ArrowBackIos } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from "next/headers" 
import BottomNav from '@/components/BottomNav';
import supabase from '@/lib/supabase';
import { usePathname, useRouter } from 'next/navigation';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
const RootLayout = ({ children }: {
    children: React.ReactNode;
}) => {
    const pathname = usePathname()
    const router = useRouter()
    const [currentLeague, setCurrentLeague] = React.useState()






    const logout = async () => {
        await supabase.auth.signOut();
        router.push("/sign-in")

    }

    return (
        <>
            {children}
        </>

    )
}

export default RootLayout