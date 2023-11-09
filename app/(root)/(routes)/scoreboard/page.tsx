"use client"

import { Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, OutlinedInput, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import React from 'react'
import Paper from '@mui/material/Paper';
import Image from 'next/image';
import Link from 'next/link';

const names = [
    'FUTO ELITES BASKETBALL LEAGUE'
];
const teams = [
    'RAPTORS',
    'OUTLAWS'
];

interface NewGame {
    type?: string
}

export default function MyGames() {
    const [open, setOpen] = React.useState(false);
    const [newGame, setNewGame] = React.useState<NewGame>({});
    const [personName, setPersonName] = React.useState<string>('');
    const [homeTeam, setHomeTeam] = React.useState<string>('');
    const [awayTeam, setAwayTeam] = React.useState<string>('');
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            value
        );
    }

    return (
        <div className="p-4">

            <Box sx={{ flexGrow: 1 }}>
                <Grid container >
                    <Grid item xs={6} md={6}>
                        <Link href="/scoreboard/1">
                            <Card variant="outlined">
                                <CardActionArea>
                                    <CardContent>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                        }} >
                                            <div className="flex-row md:w-9/12 w-7/12 mr-2">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">

                                                        {/* <Typography variant="subtitle1" >
                                                    img
                                                </Typography> */}
                                                        <Image width={20} height={20} className="grayscale mr-2" alt="Empty" src="/nets.png" />
                                                        <Typography variant="subtitle1" >
                                                            Nets
                                                        </Typography>
                                                    </div>
                                                    <Typography variant="subtitle2" >
                                                        120
                                                    </Typography>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <Image width={20} height={20} className="grayscale mr-2" alt="Empty" src="/nets.png" />
                                                        <Typography variant="subtitle1" >
                                                            Nets
                                                        </Typography>
                                                    </div>
                                                    <Typography variant="subtitle2" >
                                                        120
                                                    </Typography>
                                                </div>
                                            </div>


                                            <Divider orientation="vertical" flexItem />
                                            <div className="ml-2">
                                                <Typography variant="subtitle2" textAlign="center" >
                                                    Today
                                                </Typography>
                                                <Typography variant="caption" >
                                                    Tue, 7 Nov
                                                </Typography>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Link>

                    </Grid>

                    <Grid item xs={6} md={6}>
                        <Link href="/scoreboard/1">

                            <Card variant="outlined">
                                <CardActionArea>
                                    <CardContent>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                        }} >
                                            <div className="flex-row md:w-9/12 w-7/12 mr-2">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">

                                                        {/* <Typography variant="subtitle1" >
                                                    img
                                                </Typography> */}
                                                        <Image width={20} height={20} className="grayscale mr-2" alt="Empty" src="/nets.png" />
                                                        <Typography variant="subtitle1" >
                                                            Nets
                                                        </Typography>
                                                    </div>
                                                    {/* <Typography variant="subtitle2" >
                                                120
                                            </Typography> */}
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <Image width={20} height={20} className="grayscale mr-2" alt="Empty" src="/nets.png" />
                                                        <Typography variant="subtitle1" >
                                                            Nets
                                                        </Typography>
                                                    </div>
                                                    {/* <Typography variant="subtitle2" >
                                                120
                                            </Typography> */}
                                                </div>
                                            </div>


                                            <Divider orientation="vertical" flexItem />
                                            <div className="ml-2">
                                                <Typography variant="subtitle2" textAlign="center" >
                                                    Today
                                                </Typography>
                                                <Typography variant="caption" >
                                                    Tue, 7 Nov
                                                </Typography>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>

                            </Card>
                        </Link>

                    </Grid>


                </Grid>
            </Box>
            <div className="flex justify-center mt-6">

                <Button variant="outlined" onClick={handleClickOpen}>Create a new Game</Button>


                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Create a new game </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please provide some details for the game you want to create
                        </DialogContentText>
                        <div className="w-full">
                            <FormControl>
                                <div className="my-4 w-full">
                                    <FormLabel id="type-radio-buttons-group-label">Type</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="type-radio-buttons-group-label"
                                        defaultValue="pickup"
                                        value={newGame.type}
                                        onChange={(e) => setNewGame({ ...newGame, type: e.target.value })}
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel value="pickup" control={<Radio />} label="Pickup" />
                                        <FormControlLabel value="league" control={<Radio />} label="League Fixture" />

                                    </RadioGroup>
                                </div>
                                {newGame.type == "league" && (
                                    <>
                                        <FormControl sx={{ m: 1 }}>
                                            <FormLabel id="league-select-label">Select League</FormLabel>

                                            <Select
                                                aria-labelledby="league-select-label"
                                                displayEmpty
                                                value={personName}
                                                onChange={handleChange}

                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem disabled value="">
                                                    <em>Placeholder</em>
                                                </MenuItem>
                                                {names.map((name) => (
                                                    <MenuItem
                                                        key={name}
                                                        value={name}

                                                    >
                                                        {name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <div className="flex items-center">

                                            <FormControl sx={{ m: 1, maxWidth: 200 }}>
                                                <FormLabel id="league-select-label">Select Home Team</FormLabel>

                                                <Select
                                                    aria-labelledby="league-select-label"
                                                    displayEmpty
                                                    value={homeTeam}
                                                    onChange={(e) => setHomeTeam(e.target.value)}

                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                    <MenuItem disabled value="">
                                                        <em>Home</em>
                                                    </MenuItem>
                                                    {teams.map((name) => (
                                                        <MenuItem
                                                            key={name}
                                                            value={name}

                                                        >
                                                            {name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <span>vs</span>
                                            <FormControl sx={{ m: 1, maxWidth: 200 }}>
                                                <FormLabel id="league-select-label">Select Away Team</FormLabel>

                                                <Select
                                                    aria-labelledby="league-select-label"
                                                    displayEmpty
                                                    value={awayTeam}
                                                    onChange={(e) => setAwayTeam(e.target.value)}

                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                    <MenuItem disabled value="">
                                                        <em>Away</em>
                                                    </MenuItem>
                                                    {teams.map((name) => (
                                                        <MenuItem
                                                            key={name}
                                                            value={name}

                                                        >
                                                            {name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>

                                    </>
                                )}




                            </FormControl>
                        </div>

                        {/* <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="standard"
                        /> */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleClose}>Create</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}
