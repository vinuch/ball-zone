"use client"

import { Avatar, Button, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Radio, RadioGroup, Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import styled from '@emotion/styled'
// import SelectPlayer from './components/select-player';
import React, { useEffect, useState } from 'react';

import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import supabase from '@/lib/supabase';


export interface ConfirmationDialogRawProps {
    id: string;
    keepMounted: boolean;
    value: string;
    open: boolean;
    onClose: (value?: string) => void;
}

const emails = ['username@gmail.com', 'user02@gmail.com'];

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Select player that scored</DialogTitle>
            <List sx={{ pt: 0 }}>
                {emails.map((email) => (
                    <ListItem disableGutters key={email}>
                        <ListItemButton onClick={() => handleListItemClick(email)}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={email} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disableGutters>
                    <ListItemButton
                        autoFocus
                        onClick={() => handleListItemClick('addAccount')}
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <AddIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Add account" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Dialog>
    );
}

export default function Scoreboard() {
    // console.log(supabase)
    const [open, setOpen] = useState(false)
    const [homeFoulCount, setHomeFoulCount] = useState(0)
    const [awayFoulCount, setAwayFoulCount] = useState(0)

    const [selectedValue, setSelectedValue] = React.useState(emails[1]);

    // useEffect(() => {
    //     const signup = async () => {
    //         const { data, error } = await supabase.auth.signUp({
    //             email: 'someone@email.com',
    //             password: 'some-secure-password'
    //         })

    //         console.log(data, error)
    //     }

    //     signup()

    // }, [])


    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
        setSelectedValue(value);
    }
    return (
        <ThemeProvider theme={darkTheme}>

            <div className="h-screen w-screen flex justify-center">
                <Container sx={{ marginY: 2, height: "100%" }}>


                    <Paper elevation={3}
                        sx={{
                            display: 'flex',
                            height: "94%",
                            flexWrap: 'wrap',
                            '& > :not(style)': {
                                m: 1,
                                width: "100%",

                            }
                        }}>
                        <div>
                            <div className="text-center text-4xl font-bold my-4">10:00 <span className="text-red-600">25</span></div>
                            <p className="text-center">First Quater</p>
                            <div className="flex my-6 items-center justify-center flex-wrap w-full">
                                <div className="w-full my-6 md:w-5/12">
                                    <p className="text-center text-3xl font-bold">25</p>
                                    <p className="text-center text-slate-500 text-xl font-bold">Raptors</p>
                                    <p className="text-center text-sm font-light">Home</p>

                                    <div className="my-6">

                                        <Stack spacing={1} direction="row" justifyContent="center">
                                            <Button onClick={handleClickOpen} color="error" size="small" variant="outlined">
                                                +1
                                            </Button>
                                            <Button onClick={handleClickOpen} color="error" size="small" variant="outlined">
                                                +2
                                            </Button>
                                            <Button onClick={handleClickOpen} color="error" size="small" variant="outlined">
                                                +3
                                            </Button>
                                        </Stack>
                                        <div className="flex items-center justify-center gap-4 my-4">
                                            <p className="font-medium">Fouls</p>
                                            <div className="flex gap-2">
                                                {
                                                    [0, 1, 2, 3, 4].map(item => (
                                                        <span key={item} className={`w-4 h-4 border border-slate-300 ${homeFoulCount > item ? 'bg-red-500' : ''} rounded-full`}></span>

                                                    ))
                                                }

                                            </div>
                                            <IconButton disabled={homeFoulCount >= 5} onClick={() => homeFoulCount < 5 ? setHomeFoulCount(homeFoulCount + 1) : ''} color="warning" sx={{ bgcolor: "blue" }}>
                                                <AddIcon />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center w-full md:w-10 font-bold">VS</p>
                                <div className="w-full my-6 md:w-5/12">
                                    <p className="text-center text-3xl font-bold">25</p>
                                    <p className="text-center text-slate-500 text-xl font-bold">Outlaws</p>
                                    <p className="text-center text-sm font-light">Away</p>

                                    <div className="my-6">
                                        <Stack spacing={1} direction="row" justifyContent="center">
                                            <Button onClick={handleClickOpen} color="error" size="small" variant="outlined">
                                                +1
                                            </Button>
                                            <Button onClick={handleClickOpen} color="error" size="small" variant="outlined">
                                                +2
                                            </Button>
                                            <Button onClick={handleClickOpen} color="error" size="small" variant="outlined">
                                                +3
                                            </Button>
                                        </Stack>
                                        <div className="flex items-center justify-center gap-4 my-4">
                                            <p className="font-medium">Fouls</p>
                                            <div className="flex gap-2">
                                                {
                                                    [0, 1, 2, 3, 4].map(item => (
                                                        <span key={item} className={`w-4 h-4 border border-slate-300 ${awayFoulCount > item ? 'bg-red-500' : ''} rounded-full`}></span>

                                                    ))
                                                }

                                            </div>
                                            <IconButton disabled={awayFoulCount >= 5} onClick={() => awayFoulCount < 5 ? setAwayFoulCount(awayFoulCount + 1) : ''} color="warning" sx={{ bgcolor: "blue" }}>
                                                <AddIcon />
                                            </IconButton>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <SimpleDialog
                            selectedValue={selectedValue}
                            open={open}
                            onClose={handleClose}
                        />
                    </Paper>
                </Container>
            </div>

        </ThemeProvider>
    )
}
