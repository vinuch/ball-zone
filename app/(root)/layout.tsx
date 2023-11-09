"use client"
import Link from 'next/link'
import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Paper } from '@mui/material';
import { ContentPaste, Notifications, People, Person2 } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const RootLayout = ({ children }: {
    children: React.ReactNode;
}) => {
    const [value, setValue] = React.useState(0);

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
            </Paper>
        </div>
    )
}

export default RootLayout