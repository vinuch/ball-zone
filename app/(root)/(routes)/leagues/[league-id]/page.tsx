"use client"

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import supabase from '@/lib/supabase';
import { Avatar, Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';
import { usePathname } from 'next/navigation';
export interface Game {
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
interface Team {
    created_at: string
    created_by: string | null
    id: string
    location: string | null
    logo: string | null
    name: string | null
}
export interface Player {
    auth_user: string | null
    created_at: string
    DOB: string | null
    first_name: string | null
    height: number | null
    last_name: string | null
    location: string | null
    position: string | null
    profile_img: string | null
    user_id: string
    weight: number | null
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
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

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function LeagueId() {
    const pathname = usePathname()
    // console.log(pathname.split('/')[2])
    const [games, setGames] = React.useState<Game[] | any[]>([])
    const [teams, setTeams] = React.useState<Team[] | any[]>([])
    const [players, setPlayers] = React.useState<Player[] | any[]>([])
    // const supabase = createClientComponentClient()
    React.useEffect(() => {
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
        const fetchTeams = async () => {
            let { data: Teams, error } = await supabase
                .from('teams')
                .select(`
                *,
                home_games:Games!home_team_id(*),
                away_games:Games!away_team_id(*)

              `);
            let computedTeams: Team[] | undefined = Teams?.map(team => {
                let games = [...team.home_games, ...team.away_games]

                // compute wins
                const homeWins = team.home_games.filter((game: Game) => game.home_final_score > game.away_final_score)
                const awayWins = team.away_games.filter((game: Game) => game.away_final_score > game.home_final_score)

                //compute losses
                const homeLosses = team.home_games.filter((game: Game) => game.home_final_score < game.away_final_score)
                const awayLosses = team.away_games.filter((game: Game) => game.away_final_score < game.home_final_score)

                let wins = homeWins.length + awayWins.length
                let losses = homeLosses.length + awayLosses.length

                return {
                    ...team,
                    games,
                    wins,
                    losses,
                    homeWins,
                    homeLosses,
                    awayLosses
                }
            })

            setTeams(computedTeams!)
        }

        const fetchAveragePoints = async () => {
            let { data } = await supabase
                .rpc('getaveragepoints')
        }

        const fetchPlayers = async () => {
            let { data: players } = await supabase
                .from('team_user')
                .select(`
                *,
                user:Users!user_id(*),
                team:teams!team_id(*)
       
              `)
                .eq("league_id", pathname.split('/')[2])

            setPlayers(players!)
        }

        fetchGames()
        fetchTeams()
        fetchAveragePoints()
        fetchPlayers()
        return () => {

        }
    }, [])


    const getTeam = (team_id: string) => {
        return teams.find(item => item.id === team_id)
    }
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    if (!games.length) {
        return <div className="flex justify-center items-center h-full">
            <CircularProgress />
        </div>
    }



    function createData(
        name: string,
        calories: number,
        fat: number,
        carbs: number,
        protein: number,
    ) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];

    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="disabled tabs example">
                    <Tab label="Games" {...a11yProps(0)} />
                    <Tab label="Standings" {...a11yProps(1)} />
                    <Tab label="Stats" {...a11yProps(2)} />
                    {/* <Tab label="Teams" {...a11yProps(3)} /> */}
                    <Tab label="Players" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                {
                    !games ? <p>No Games</p> : (
                        <Box sx={{ flexGrow: 1 }}>

                            <Grid container >
                                {
                                    games.map(game => (
                                        <Grid key={game.id} item xs={12} md={6}>
                                            <Link href="#">
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
                    )
                }

            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <TableContainer component={Paper} elevation={0}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Team</TableCell>
                                <TableCell align="right">W</TableCell>
                                <TableCell align="right">L</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teams.map((row, idx) => (
                                <TableRow
                                    key={idx}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.wins}</TableCell>
                                    <TableCell align="right">{row.losses}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>

            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <Box sx={{ flexGrow: 1 }}>

                    <Grid container >
                        {
                            players.map((item, idx) => {
                                
                                return (
                                    <Grid item key={idx} xs={12} md={6} lg={3} xl={2}>
                                        <Card sx={{m: 2}}>
                                            <CardMedia
                                                component="img"
                                                sx={{ height: 240 }}
                                                image={item.user.profile_img}
                                                title={item.user.name}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {item.user.first_name} {item.user.last_name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.user.position || '-'}
                                                </Typography>

                                                <div className="flex gap-2 my-2">
                                                    <Avatar alt="Remy Sharp" src={item.team?.logo} sx={{ width: 24, height: 24 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.team?.name}
                                                    </Typography>
                                                </div>

                                            </CardContent>
                                            {/* <CardActions>
                        <Button size="small">Share</Button>
                        <Button size="small">Learn More</Button>
                    </CardActions> */}
                                        </Card>
                                    </Grid>
                                )

                            })
                        }

                    </Grid>
                </Box>

            </CustomTabPanel>
            {/* <CustomTabPanel value={value} index={4}>
                Item Five
            </CustomTabPanel> */}
        </div>
    )
}
