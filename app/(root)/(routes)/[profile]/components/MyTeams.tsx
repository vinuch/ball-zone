"use client"

import { useEffect, useState } from "react"
import supabase from '@/lib/supabase';
import { Autocomplete, Avatar, Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Typography, createFilterOptions } from "@mui/material";
import Link from "next/link";
import Add from "@mui/icons-material/Add";

type MyTeamsProps = {
    player_id: string
}

type Team = {
    first_name: string
    id?: string
    team?: string
}

type User = {
    user_id?: string
}

export default function MyTeams({ player_id }: MyTeamsProps) {
    const [playerTeams, setPlayerTeams] = useState<any[]>([])
    const [open, setOpen] = useState<boolean>(false)
    const [team, setTeam] = useState({});
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [players, setPlayers] = useState([]);
    const [appUser, setAppUser] = useState<User>({})
    const [authUserID, setAuthUserId] = useState()
    const filter = createFilterOptions<FilmOptionType>();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const fetchUser = async () => {
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


        }

        const fetchCurrentPlayersTeams = async (id: string) => {
            let { data: Teams, error } = await supabase
                .from('team_user')
                .select(`
                *,
                team:teams!team_id(*)
              `).eq(`user_id`, id);

            setPlayerTeams(Teams!.map(item => item.team))
        }
        const fetchPlayers = async () => {
            let { data: players } = await supabase
                .from('Users')
                .select(`
                *
       
              `)
            // console.log(players?.map(item => item.user)) 

            setPlayers(players?.map(item => item))
        }

        fetchUser()
        fetchPlayers()
        fetchCurrentPlayersTeams(player_id)

    }, [])

    const handleCreate = async () => {

        //create not existing users 
        let data: Team[] = []
        // .filter(item => item.includes('(new)')).map(t => t.slice(0, -5))
        // .filter(item => item.includes('(new)')).map(t => t.slice(0, -5))
        teamPlayers.forEach(item => data.push({ first_name: item }))
        if(appUser?.user_id){
            data.push({ first_name: appUser.user_id})

        }
        console.log(data)

        if (data.length) {
            // const [teamx, first_name] = data

            console.log(data)
            supabase
                .from('Users')
                .insert(data.filter(item => item.first_name.includes('(new)')).map(item => { return { first_name: item.first_name.slice(0, -5) } })).select().then(userRes => {
                    if (userRes?.data) {
                        userRes.data.forEach(item => {
                            let newUser = data.find(p => p.first_name === `${item.first_name}(new)`)
                            if (newUser) {
                                newUser.id = item.user_id
                            }
                        })
                        supabase
                            .from('teams')
                            .insert({...team, created_by: appUser?.user_id })
                            .select().then(async teamRes => {
                                if (teamRes.data) {

                                    await supabase
                                        .from('team_user')
                                        .insert(data.map(item => { return { team_id: teamRes.data[0].id, user_id: item.id || item.first_name } }))
                                        .select()

                                }

                            })
                    }
                })
        }

    }



return (
    <div className="mt-12">
        <h2>My teams</h2>

        <Grid container >
            {
                playerTeams.map((item, idx) => {

                    return (
                        <Grid item key={idx} xs={6} md={6} lg={4} xl={2}>
                            <Card sx={{ m: 2 }}>
                                {/* <CardMedia
                                        component="img"
                                        sx={{ height: 240 }}
                                        image={item.user.profile_img || '/profile-pic.png'}
                                        title={item.user.name}
                                    /> */}
                                <CardContent>
                                    <Link href={`/team/${item.id}`}>
                                        <Typography gutterBottom variant="h5" component="div" className="hover:underline">
                                            {item.name}
                                        </Typography>
                                    </Link>
                                    <Typography variant="body2" color="text.secondary">
                                        {/* {item.user.position || '-'} */}
                                    </Typography>

                                    <div className="flex gap-2 my-2">
                                        <Avatar alt="Remy Sharp" src={item.logo} sx={{ width: 24, height: 24 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {item.name}
                                        </Typography>
                                    </div>

                                </CardContent>

                            </Card>
                        </Grid>

                    )
                }
                )}
            <Grid item xs={12}>
                <Button
                    variant="outlined"
                    className="w-full"
                    onClick={() => setOpen(true)}
                >
                    New team
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Create Team</DialogTitle>
                    <DialogContent>
                        <DialogContentText className="mb-4">
                            Please provide some details for the team you want to create
                        </DialogContentText>
                        <TextField id="outlined-basic" sx={{ marginBottom: 2 }} label="Team Name" placeholder="Enter name for team " variant="outlined" fullWidth onChange={e => setTeam({ ...team, name: e.target.value })} />

                        <Autocomplete
                            // value={awayTeamPlayers}
                            key='away'
                            onChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                    setTeamPlayers(newValue.map(item => item.user_id))
                                } else if (newValue && newValue.inputValue) {
                                    setTeamPlayers(newValue.inputValue.map(item => item.user_id))
                                } else {
                                    setTeamPlayers(newValue.map(item => item.user_id || item.inputValue))

                                }
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                const { inputValue } = params;
                                // Suggest the creation of a new value
                                const isExisting = options.some((option) => `${option.first_name} ${option.last_name}`.includes(inputValue));
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push({
                                        inputValue: `${inputValue}(new)`,
                                        first_name: `Add "${inputValue}"`,
                                    });
                                }

                                return filtered;
                            }}
                            getOptionLabel={(option) => {
                                // Value selected with enter, right from the input

                                // console.log(option)
                                // return 'hi'
                                if (typeof option === 'string') {
                                    return option;
                                }
                                // Add "xxx" option created dynamically
                                if (option.inputValue) {

                                    return option.inputValue;
                                }


                                // Regular option
                                return option.first_name;
                            }}
                            renderOption={(props, option) => <li {...props} key={option.user_id}>{option.first_name}</li>}
                            freeSolo
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            multiple
                            id="tags-standard"
                            options={players}

                            renderInput={(params, idx) => (
                                <TextField
                                    {...params}
                                    key={idx}
                                    variant="standard"
                                    label="Team Players"
                                    placeholder="Team players"
                                // onKeyDown={handleClickEnter}
                                />

                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleCreate}>Create Team</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </Grid>
    </div>
)
}