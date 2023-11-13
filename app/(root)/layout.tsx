
import Link from 'next/link'
import * as React from 'react';
import Box from '@mui/material/Box';

import { Paper } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import { cookies } from "next/headers"
import BottomNav from '@/components/BottomNav';

const RootLayout = async ({ children }: {
    children: React.ReactNode;
}) => {
    const supabase = createServerComponentClient({ cookies })

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect("/sign-in")
    }
    return (
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
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Ball Zone
                        </Typography>
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
    )
}

export default RootLayout