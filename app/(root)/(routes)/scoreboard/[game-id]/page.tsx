"use client"

import { Avatar, Box, Button, CircularProgress, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Radio, RadioGroup, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import styled from '@emotion/styled'
// import SelectPlayer from './components/select-player';
import React, { useEffect, useState } from 'react';

import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import supabase from '@/lib/supabase';
import { usePathname } from 'next/navigation';
import { Game, Player } from '../../leagues/[league-id]/page';


export interface ConfirmationDialogRawProps {
    id: string;
    keepMounted: boolean;
    value: string;
    open: boolean;
    onClose: (value?: string) => void;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
const emails = ['username@gmail.com', 'user02@gmail.com'];

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    homePlayers: any;
    awayPlayers: any;
    team: string;
    onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, selectedValue, open, homePlayers, awayPlayers, team } = props;

    const handleClose = () => {
        onClose(null);
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };

    let playerList = [];
    if (team == 'home') {
        playerList = homePlayers
    } else if (team == 'away') {
        playerList = awayPlayers

    }
    return (
        <Dialog fullWidth onClose={handleClose} open={open}>
            <DialogTitle>Select player</DialogTitle>
            <List sx={{ pt: 0 }}>
                {playerList.map((player: any) => (
                    <ListItem disableGutters key={player.player_id}>
                        <ListItemButton onClick={() => handleListItemClick(player)}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${player.player.first_name} ${player.player.last_name}`} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {/* <ListItem disableGutters>
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
                </ListItem> */}
            </List>
        </Dialog>
    );
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}


export default function Scoreboard() {
    // console.log(supabase)
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(0)
    const [homeFoulCount, setHomeFoulCount] = useState(0)
    const [awayFoulCount, setAwayFoulCount] = useState(0)
    const [game, setGame] = useState<Game | {}>()
    const [homePlayers, setHomePlayers] = useState<Player[] | []>([])
    const [homePlayersStats, setHomePlayersStats] = useState<Player[] | []>([])
    const [awayPlayers, setAwayPlayers] = useState<Player[] | []>([])
    const [awayPlayersStats, setAwayPlayersStats] = useState<Player[] | []>([])

    const [activeTeam, setActiveTeam] = useState('')
    const [activeStat, setActiveStat] = useState({})

    const [selectedValue, setSelectedValue] = React.useState(emails[1]);

    const home_ongoing_score = () => {
        return homePlayersStats.reduce(  (accumulator, stat) => accumulator + stat.points,
        0,)
    }

    const away_ongoing_score = () => {
        return awayPlayersStats.reduce(  (accumulator, stat) => accumulator + stat.points,
        0,)
    }

    const pathname = usePathname()

    const gameId = pathname.split('/')[2]
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

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    useEffect(() => {
        const fetchTeamPlayers = async (team_id: string) => {
            let { data: players, error } = await supabase
                .from('team_user')

                .select(`
                *,
                player:Users!user_id(*)

              `)
                // .eq('game_id', game_id)
                .eq('team_id', team_id);


            return players;

        }
        const fetchTeamPlayersStats = async (game_id: string, team_id: string) => {
            console.log(game_id)
            let { data: players, error } = await supabase
                .from('game_player_stats')

                .select(`
                *,
                player:Users!user_id(*)
              `)
                .eq('game_id', game_id)
                .eq('team_id', team_id);


            return players;

        }
        // fetch game
        const fetchGames = async () => {
            await supabase
                .from('Games')

                .select(`
                *,
                home_team:teams!home_team_id(*),
                away_team:teams!away_team_id(*)

              `).eq('id', gameId).then(res => {
                    let game = res.data![0];
                    setGame(game);
                    fetchTeamPlayers(game.home_team_id).then(res => setHomePlayers(res))
                    fetchTeamPlayers(game.away_team_id).then(res => setAwayPlayers(res))

                    fetchTeamPlayersStats(game.id, game.home_team_id).then(res => setHomePlayersStats(res))
                    fetchTeamPlayersStats(game.id, game.away_team_id).then(res => setAwayPlayersStats(res))
                });


            // setGame(Games![0])

        }


        // fetch game stats 
        fetchGames()
    }, [gameId])



    const addPoint = (points: number, player_id: string, league_id: string) => {

    }

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    const handleClickOpen = (team: string, stat: string, incrementBy: number) => {
        setOpen(true);
        setActiveTeam(team)
        setActiveStat({ stat, incrementBy })
    };

    const handleClose = async (player: any) => {
        setOpen(false);
        console.log(homePlayersStats)
        // setSelectedValue(value);


        //make api call

        // check if value is in game_player_stats
        if (activeTeam == 'home') {
            if (player) {
                const playerStat = homePlayersStats.find(stat => stat.player_id == player.user_id) || null
                console.log(player)
                if (playerStat) {
                    const { data, error } = await supabase
                        .from('game_player_stats')
                        .update([
                            { [activeStat.stat]: playerStat[activeStat.stat] + activeStat.incrementBy, player_id: player.user_id, team_id: player.team_id, game_id: gameId, league_id: game!.league_id },
                        ])
                        .eq('id', Number(playerStat.id))
                        .select()

                    if (data) {
                        let updatedStat = data[0]
                        if (updatedStat) {
                            let _player = { ...homePlayersStats.find(item => item.id == updatedStat.id), ...{ ...updatedStat, player: player.player } }
                            setHomePlayersStats([...homePlayersStats.filter(item => item.id !== updatedStat.id), _player])
                        }
                    }
                } else {
                    const { data, error } = await supabase
                        .from('game_player_stats')
                        .insert([
                            { [activeStat.stat]: (player[activeStat.stat] || 0) + activeStat.incrementBy, player_id: player.user_id, team_id: player.team_id, game_id: gameId, league_id: game!.league_id },
                        ])
                        .select()

                    if (data) {
                        let updatedStat = data[0]
                        if (updatedStat) {
                            let _player = { ...homePlayersStats.find(item => item.id == updatedStat.id), ...{ ...updatedStat, player: player.player } }
                            setHomePlayersStats([...homePlayersStats.filter(item => item.id !== updatedStat.id), _player])
                        }
                    }


                }
            }
        } else if (activeTeam == 'away') {
            if (player) {
                const playerStat = awayPlayersStats.find(stat => stat.player_id == player.user_id) || null
                console.log(player)
                if (playerStat) {
                    const { data, error } = await supabase
                        .from('game_player_stats')
                        .update([
                            { [activeStat.stat]: playerStat[activeStat.stat] + activeStat.incrementBy, player_id: player.user_id, team_id: player.team_id, game_id: gameId, league_id: game!.league_id },
                        ])
                        .eq('id', Number(playerStat.id))
                        .select()

                    if (data) {
                        let updatedStat = data[0]
                        if (updatedStat) {
                            let _player = { ...awayPlayersStats.find(item => item.id == updatedStat.id), ...{ ...updatedStat, player: player.player } }
                            setAwayPlayersStats([...awayPlayersStats.filter(item => item.id !== updatedStat.id), _player])
                        }
                    }
                } else {
                    const { data, error } = await supabase
                        .from('game_player_stats')
                        .insert([
                            { [activeStat.stat]: (player[activeStat.stat] || 0) + activeStat.incrementBy, player_id: player.user_id, team_id: player.team_id, game_id: gameId, league_id: game!.league_id },
                        ])
                        .select()

                    if (data) {
                        let updatedStat = data[0]
                        if (updatedStat) {
                            let _player = { ...awayPlayersStats.find(item => item.id == updatedStat.id), ...{ ...updatedStat, player: player.player } }
                            setAwayPlayersStats([...awayPlayersStats.filter(item => item.id !== updatedStat.id), _player])
                        }
                    }


                }
            }
        }


    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    if (!game) {
        return <div className="flex justify-center items-center">
            <CircularProgress />
        </div>
    }
    return (
        <ThemeProvider theme={darkTheme}>

            <div className="h-auto w-screen flex justify-center">
                <Container sx={{ marginY: 2, height: "100%" }}>


                    <Paper elevation={3}
                        sx={{
                            display: 'flex',
                            height: "auto",
                            flexWrap: 'wrap',
                            '& > :not(style)': {
                                m: 1,
                                width: "100%",

                            }
                        }}>
                        <div>
                            {/* <div className="text-center text-4xl font-bold my-4">10:00 <span className="text-red-600">25 (WIP)</span></div>
                            <p className="text-center">First Quater</p> */}
                            <div className="flex my-6 items-center justify-center flex-wrap w-full">
                                <div className="w-full my-6 md:w-5/12">
                                    <p className="text-center text-3xl font-bold">{home_ongoing_score()}</p>
                                    <p className="text-center text-slate-500 text-xl font-bold">{game.home_team.name}</p>
                                    <p className="text-center text-sm font-light">Home</p>

                                    <div className="my-6">

                                        <Stack spacing={1} direction="row" justifyContent="center">
                                            <Button onClick={() => handleClickOpen('home', 'points', 1)} color="error" size="small" variant="outlined">
                                                +1
                                            </Button>
                                            <Button onClick={() => handleClickOpen('home', 'points', 2)} color="error" size="small" variant="outlined">
                                                +2
                                            </Button>
                                            <Button onClick={() => handleClickOpen('home', 'points', 3)} color="error" size="small" variant="outlined">
                                                +3
                                            </Button>
                                        </Stack>

                                        <Stack spacing={1} direction="row" justifyContent="center" className="my-3">
                                            <Button onClick={() => handleClickOpen('home', 'rebounds', 1)} color="error" size="small" variant="outlined">
                                                rebound
                                            </Button>
                                            <Button onClick={() => handleClickOpen('home', 'blocks', 1)} color="error" size="small" variant="outlined">
                                                block
                                            </Button>
                                            <Button onClick={() => handleClickOpen('home', 'steals', 1)} color="error" size="small" variant="outlined">
                                                steal
                                            </Button>
                                            <Button onClick={() => handleClickOpen('home', 'fouls', 1)} color="error" size="small" variant="outlined">
                                                foul
                                            </Button>
                                        </Stack>
                                        {/* <div className="flex items-center justify-center gap-4 my-4">
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
                                        </div> */}
                                    </div>
                                </div>
                                <p className="text-center w-full md:w-10 font-bold">VS</p>
                                <div className="w-full my-6 md:w-5/12">
                                    <p className="text-center text-3xl font-bold">{away_ongoing_score()}</p>
                                    <p className="text-center text-slate-500 text-xl font-bold">{game.away_team.name}</p>
                                    <p className="text-center text-sm font-light">Away</p>

                                    <div className="my-6">
                                        <Stack spacing={1} direction="row" justifyContent="center">
                                            <Button onClick={() => handleClickOpen('away', 'points', 1)} color="error" size="small" variant="outlined">
                                                +1
                                            </Button>
                                            <Button onClick={() => handleClickOpen('away', 'points', 2)} color="error" size="small" variant="outlined">
                                                +2
                                            </Button>
                                            <Button onClick={() => handleClickOpen('away', 'points', 3)} color="error" size="small" variant="outlined">
                                                +3
                                            </Button>
                                        </Stack>

                                        <Stack spacing={1} direction="row" justifyContent="center" className="my-3">
                                            <Button onClick={() => handleClickOpen('away', 'rebounds', 1)} color="error" size="small" variant="outlined">
                                                rebound
                                            </Button>
                                            <Button onClick={() => handleClickOpen('away', 'blocks', 1)} color="error" size="small" variant="outlined">
                                                block
                                            </Button>
                                            <Button onClick={() => handleClickOpen('away', 'steals', 1)} color="error" size="small" variant="outlined">
                                                steal
                                            </Button>
                                            <Button onClick={() => handleClickOpen('away', 'fouls', 1)} color="error" size="small" variant="outlined">
                                                foul
                                            </Button>
                                            
                                        </Stack>
                                        {/* <div className="flex items-center justify-center gap-4 my-4">
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
                                        </div> */}
                                    </div>

                                </div>
                            </div>
                            <div className="h-72">
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="disabled tabs example">
                                        <Tab label="Home" {...a11yProps(0)} />
                                        <Tab label="Away" {...a11yProps(1)} />

                                    </Tabs>
                                </Box>
                                <CustomTabPanel value={value} index={0}>
                                    <TableContainer component={Paper} elevation={0}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Player</TableCell>
                                                    <TableCell align="right">Points</TableCell>
                                                    <TableCell align="right">Rebounds</TableCell>
                                                    <TableCell align="right">Assists</TableCell>
                                                    <TableCell align="right">Blocks</TableCell>
                                                    <TableCell align="right">Steals</TableCell>
                                                    <TableCell align="right">Fouls</TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                                {homePlayersStats && homePlayersStats.map(row => (
                                                    <TableRow
                                                        key='1'
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.player.first_name}
                                                        </TableCell>
                                                        <TableCell align="right">{row.points || 0}</TableCell>
                                                        <TableCell align="right">{row.rebounds || 0}</TableCell>
                                                        <TableCell align="right">{row.assists || 0}</TableCell>
                                                        <TableCell align="right">{row.blocks || 0}</TableCell>
                                                        <TableCell align="right">{row.steals || 0}</TableCell>
                                                        <TableCell align="right">{row.fouls || 0}</TableCell>

                                                    </TableRow>
                                                ))}
                                                {/* {teams.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.wins}</TableCell>
                                    <TableCell align="right">{row.losses}</TableCell>

                                </TableRow>
                            ))} */}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CustomTabPanel>
                                <CustomTabPanel value={value} index={1}>
                                    <TableContainer component={Paper} elevation={0}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Player</TableCell>
                                                    <TableCell align="right">Points</TableCell>
                                                    <TableCell align="right">Rebounds</TableCell>
                                                    <TableCell align="right">Assists</TableCell>
                                                    <TableCell align="right">Blocks</TableCell>
                                                    <TableCell align="right">Steals</TableCell>
                                                    <TableCell align="right">Fouls</TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {/* {teams.map((row) => ( */}

                                                {awayPlayersStats && awayPlayersStats.map(row => (
                                                    <TableRow
                                                        key='1'
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.player.first_name}
                                                        </TableCell>
                                                        <TableCell align="right">{row.points || 0}</TableCell>
                                                        <TableCell align="right">{row.rebounds || 0}</TableCell>
                                                        <TableCell align="right">{row.assists || 0}</TableCell>
                                                        <TableCell align="right">{row.blocks || 0}</TableCell>
                                                        <TableCell align="right">{row.steals || 0}</TableCell>
                                                        <TableCell align="right">{row.fouls || 0}</TableCell>

                                                    </TableRow>
                                                ))}

                                                {/* ))}
                             */}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CustomTabPanel>
                            </div>

                        </div>
                        <SimpleDialog
                            selectedValue={selectedValue}
                            homePlayers={homePlayers}
                            awayPlayers={awayPlayers}
                            open={open}
                            team={activeTeam}
                            onClose={handleClose}
                        />
                    </Paper>
                </Container>
            </div>

        </ThemeProvider>
    )
}
