"use client"

import { Autocomplete, Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Input, MenuItem, OutlinedInput, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import Paper from '@mui/material/Paper';
import Image from 'next/image';
import Link from 'next/link';
import supabase from '@/lib/supabase';
import { usePathname } from 'next/navigation';

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

const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
]

export default function MyGames() {
    const [open, setOpen] = React.useState(false);
    const [games, setGames] = React.useState<Game[] | any[]>([]);
    const [newGame, setNewGame] = React.useState<Game>({});
    const [personName, setPersonName] = React.useState<string>('');
    const [homeTeam, setHomeTeam] = React.useState<string>('');
    const [awayTeam, setAwayTeam] = React.useState<string>('')
    ;
    const [homeTeamPlayers, setHomeTeamPlayers] = React.useState([]);
    const [awayTeamPlayers, setAwayTeamPlayers] = React.useState([]);
    const [newAwayTeam, setNewAwayTeam] = React.useState<object>({});
    const [newHomeTeam, setNewHomeTeam] = React.useState<object>({});
    const [players, setPlayers] = React.useState<[]>([]);

    const [currentPlayersTeams, setCurrentPlayersTeams] = React.useState(null)
    const [appUser, setAppUser] = React.useState(null)
    const [authUserID, setAuthUserId] = React.useState()
    const [loading, setLoading] = React.useState(false)


    const pathname = usePathname()

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
        const fetchUser = async () => {
            setLoading(true)
            await supabase.auth.getSession().then(async ({ data: { session } }) => {
                setAuthUserId(session?.user.id)
                await supabase
                    .from('Users')
                    .select()
                    .eq("auth_user", session?.user.id).then(res => {
                        console.log(res)
                        if (!res.data!.length) { setAppUser(null); return }
                        setAppUser(res.data![0]);
                        console.log(res.data![0])
                        const data = res.data![0];
                    })
            })
            setLoading(false)


        }

        const fetchPlayers = async () => {
            let { data: players } = await supabase
                .from('team_user')
                .select(`
                *,
                user:Users!user_id(*),
                team:teams!team_id(*)
       
              `)
            console.log(players?.map(item => item.user))

            setPlayers(players?.map(item => item.user))
        }

        fetchPlayers()


        fetchUser()

    }, [])


    useEffect(() => {
        const fetchCurrentPlayersTeams = async (id) => {
            let { data: Teams, error } = await supabase
                .from('team_user')
                .select(`
                *
              `).eq('user_id', id);

            setCurrentPlayersTeams(Teams.map(item => item.team_id))
        }



        if (appUser) {
            fetchCurrentPlayersTeams(appUser.user_id)
        }


    }, [appUser])

    useEffect(() => {
        const fetchGames = async (teams) => {
            let { data: Games, error } = await supabase
                .from('Games')
                .select(`
                *,
                home_team:teams!home_team_id(*),
                away_team:teams!away_team_id(*)

              `)
                .or(`home_team_id.in.(${teams}),away_team_id.in.(${teams})`)



            setGames(Games!)
        }

        if (currentPlayersTeams) {
            fetchGames(currentPlayersTeams)
        }
    }, [currentPlayersTeams])


    const handleCreate = () => {
        console.log(newHomeTeam, newAwayTeam, homeTeamPlayers, awayTeamPlayers)
    }

    return (
        <div className="p-4">

            <Box sx={{ flexGrow: 1 }}>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    {
                        games.map(game => (
                            <Grid key={game.id} item xs={12} md={6}>
                                <Link href={`/games/${game.id}`}>
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
                            {/* <FormControl> */}
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
                                        {/* <FormControlLabel value="league" control={<Radio />} label="League Fixture" /> */}

                                    </RadioGroup>

                                    <FormLabel id="home-team-name">Home Team</FormLabel> <br />
                                    <FormControl>

                                        <Input placeholder="Enter name for home team " className="w-full my-2" aria-labelledby="home-team-name" onChange={e => setNewHomeTeam({...newHomeTeam, name: e.target.value})} />
                                    </FormControl>
                                    <FormLabel id="home-team-name" className='block'>Home Team Players</FormLabel> <br />

                                    <Autocomplete
                                    // value={homeTeamPlayers}
                                    // onValueChange={(event, newInputValue) => {
                                    //     setHomeTeamPlayers(newInputValue);
                                    //   }}
                                        multiple
                                        id="tags-standard"
                                        options={players}
                                        getOptionLabel={(option) => option?.first_name}
                                        defaultValue={[players[0]]}
                                        renderInput={(params, idx) => (
                                            <FormGroup>
                                                <TextField
                                                    {...params}
                                                    key={idx}
                                                    variant="standard"
                                                    label="Home Team Players"
                                                    placeholder="Home players"
                                                />
                                            </FormGroup>

                                        )}
                                    />

                                    {/* AWAY TEAM  */}
                                    <FormLabel id="away-team-name" className='block' sx={{marginTop: 2}}>Away Team</FormLabel> <br />
                                    <FormControl>

                                        <Input placeholder="Enter name for away team " className="w-full my-2" aria-labelledby="away-team-name" onChange={e => setNewAwayTeam({...newAwayTeam, name: e.target.value})}/>

                                        <FormLabel id="away-team-name">Away Team Players</FormLabel> <br />
                                    </FormControl> 
                                    <Autocomplete
                                    // value={awayTeamPlayers}

                                        multiple
                                        id="tags-standard"
                                        options={players}
                                        getOptionLabel={(option) => option?.first_name}
                                        defaultValue={[players[0]]}
                                        renderInput={(params, idx) => (
                                            <FormGroup>
                                                <TextField
                                                    {...params}
                                                    key={idx}
                                                    variant="standard"
                                                    label="Away Team Players"
                                                    placeholder="Away players"
                                                />
                                            </FormGroup>

                                        )}
                                    />
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




                            {/* </FormControl> */}
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
                        <Button onClick={handleCreate}>Create</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}
