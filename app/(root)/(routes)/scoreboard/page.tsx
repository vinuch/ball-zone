"use client"

import { Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, OutlinedInput, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import Paper from '@mui/material/Paper';
import Image from 'next/image';
import Link from 'next/link';
import supabase from '@/lib/supabase';

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

interface Game {
    away_team_id: string | null
    created_at: string
    first_quarter_score: number | null
    fourth_quarter_score: number | null
    home_team_id: string | null
    id: string
    second_quater_score: number | null
    third_quater_score: number | null
    home_final_score: number
    away_final_score: number
}

export default function MyGames() {
    const [open, setOpen] = React.useState(false);
    const [games, setGames] = React.useState<Game[] | any[]>([]);
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

    useEffect(() => {
        const fetchGames = async () => {
            let { data: Games, error } = await supabase
                .from('Games')
                .select(`
                *,
                home_team:teams!home_team_id(*),
                away_team:teams!away_team_id(*)

              `);


            setGames(Games!)
        }

        fetchGames()
    }, [])
    

    return (
        <div className="p-4">

<Box sx={{ flexGrow: 1 }}>

<Grid container >
    {
        games.map(game => (
            <Grid key={game.id} item xs={12} md={6}>
                <Link href={`/scoreboard/${game.id}`}>
                    <Card variant="outlined">
                        <CardActionArea>
                            <CardContent>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                }} >
                                    <div className="flex-row md:w-9/12 w-10/12 mr-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">

                                                {/* <Typography variant="subtitle1" >
                        img
                    </Typography> */}
                                                <Image width={20} height={20} className=" mr-2" alt="Empty" src={game.home_team?.logo} />
                                                <Typography variant="subtitle1" >
                                                    {game.home_team?.name}
                                                </Typography>
                                            </div>
                                            <Typography variant="subtitle2" >
                                                {game.home_final_score}
                                            </Typography>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <Image width={20} height={20} className=" mr-2" alt="Empty" src={game.away_team?.logo} />
                                                <Typography variant="subtitle1" >
                                                    {game.away_team?.name}
                                                </Typography>
                                            </div>
                                            <Typography variant="subtitle2" >
                                                {game.away_final_score}
                                            </Typography>
                                        </div>
                                    </div>


                                    <Divider orientation="vertical" flexItem />
                                    <div className="ml-2 md:w-4/12  w-3/12">
                                        <Typography variant="caption" textAlign="center" >
                                            Today
                                        </Typography><br />
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

        ))
    }
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
