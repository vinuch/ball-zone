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


    React.useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push("/sign-in")
            }
        }

        const fetchLeague = async () => {
            let { data: League, error } = await supabase
                .from('Leagues')
                .select(`
                name

              `).eq("id", pathname.split('/')[2]);


            setCurrentLeague(League![0])
        }

        fetchLeague()
        fetchSession()

    }, [router])




    const logout = async () => {
        await supabase.auth.signOut();
        router.push("/sign-in")

    }

    return (
        <SnackbarProvider>
            <div>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="fixed">
                        <Toolbar>
                            {/* <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton> */}
                            <IconButton color="inherit" onClick={() => router.back()}>  <ArrowBackIos /></IconButton>

                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                <div className="truncate w-56">
                                    <span > {currentLeague?.name}</span>

                                </div>
                            </Typography>
                            <IconButton color="inherit" onClick={() => logout()}>  <Logout /></IconButton>
                            <IconButton color="inherit">  <Notifications /></IconButton>
                        </Toolbar>
                    </AppBar>

                </Box>
                <div className="my-20">
                    {children}

                </div>
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>

                    <BottomNav />
                </Paper>
            </div>
        </SnackbarProvider>

    )
}

export default RootLayout