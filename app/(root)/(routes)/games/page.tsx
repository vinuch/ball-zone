"use client";

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Input,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import React, { useEffect } from "react";
import { formatDistance } from "date-fns";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import Link from "next/link";
import supabase from "@/lib/supabase";
import { usePathname } from "next/navigation";

const names = ["FUTO ELITES BASKETBALL LEAGUE"];
const teams = ["RAPTORS", "OUTLAWS"];

interface NewGame {
  type?: string;
}

interface Game {
  away_team_id: string | null;
  created_at: string;
  first_quarter_score: number | null;
  fourth_quarter_score: number | null;
  home_team_id: string | null;
  id: string;
  second_quater_score: number | null;
  third_quater_score: number | null;
  home_final_score: number;
  away_final_score: number;
}

const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: "Pulp Fiction", year: 1994 },
];

export default function MyGames() {
  const [open, setOpen] = React.useState(false);
  const [games, setGames] = React.useState<Game[] | any[]>([]);
  const [newGame, setNewGame] = React.useState<Game>();
  const [personName, setPersonName] = React.useState<string>("");
  const [homeTeam, setHomeTeam] = React.useState<string>("");
  const [awayTeam, setAwayTeam] = React.useState<string>("");
  const [homeTeamPlayers, setHomeTeamPlayers] = React.useState([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = React.useState([]);
  // const [newAwayTeam, setNewAwayTeam] = React.useState<object>({});
  // const [newHomeTeam, setNewHomeTeam] = React.useState<object>({});
  const [homeTeamName, setHomeTeamName] = React.useState("");
  const [awayTeamName, setAwayTeamName] = React.useState("");

  const [players, setPlayers] = React.useState<any[]>();
  const [refree, setRefree] = React.useState<[]>([]);

  const [currentPlayersTeams, setCurrentPlayersTeams] = React.useState<any[]>();
  const [appUser, setAppUser] = React.useState(null);
  const [authUserID, setAuthUserId] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);

  const pathname = usePathname();

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
    setPersonName(value);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      await supabase.auth.getSession().then(async ({ data: { session } }) => {
        setAuthUserId(session?.user.id);
        await supabase
          .from("Users")
          .select()
          .eq("auth_user", session?.user.id)
          .then((res) => {
            console.log(res);
            if (!res.data!.length) {
              setAppUser(null);
              return;
            }
            setAppUser(res.data![0]);
            console.log(res.data![0]);
            const data = res.data![0];
          });
      });
      setLoading(false);
    };

    const fetchPlayers = async () => {
      let { data: players } = await supabase.from("Users").select(`
                *
       
              `);
      // console.log(players?.map(item => item.user))

      setPlayers(players?.map((item) => item));
    };

    // fetchPlayers()

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCurrentPlayersTeams = async (id: any) => {
      let { data: Teams, error } = await supabase
        .from("team_user")
        .select(
          `
                *
              `
        )
        .eq("user_id", id);

      setCurrentPlayersTeams(Teams?.map((item) => item.team_id));
    };

    if (appUser) {
      fetchCurrentPlayersTeams(appUser.user_id);
    }
  }, [appUser]);

  useEffect(() => {
    const fetchGames = async () => {
      let { data: Games, error } = await supabase
        .from("Games")
        .select(
          `
                *,
                home_team:teams!home_team_id(*),
                away_team:teams!away_team_id(*)

              `
        )
        .order("created_at", { ascending: false })
        .limit(10);

      setGames(Games!);
    };

    if (currentPlayersTeams) {
      fetchGames();
    }
  }, [currentPlayersTeams]);

  // const handleCreate = async () => {
  //     console.log(newHomeTeam, newAwayTeam, homeTeamPlayers, awayTeamPlayers, refree)

  //     //create not existing users
  //     let data = []
  //     // .filter(item => item.includes('(new)')).map(t => t.slice(0, -5))
  //     // .filter(item => item.includes('(new)')).map(t => t.slice(0, -5))
  //     let l = [...homeTeamPlayers].forEach(item => data.push({ first_name: item, team: 'home' }))
  //     let d = [...awayTeamPlayers].forEach(item => data.push({ first_name: item, team: 'away' }))
  //     console.log(data)

  //     if (data.length) {
  //         const [team, first_name] = data
  //         supabase
  //             .from('Users')
  //             .insert(data.filter(item => item.first_name.includes('(new)')).map(item => { return { first_name: item.first_name.slice(0, -5) } })).select().then(userRes => {
  //                 userRes.data.forEach(item => {
  //                     data.find(p => p.first_name === `${item.first_name}(new)`).id = item.user_id
  //                 })
  //                 supabase
  //                     .from('teams')
  //                     .insert([newHomeTeam, newAwayTeam])
  //                     .select().then(async teamRes => {
  //                         console.log({ home_team_id: teamRes.data[0].id, away_team_id: teamRes.data[1].id }, data)

  //                         await supabase
  //                             .from('team_user')
  //                             .insert(data.map(item => { return { team_id: item.team === 'home' ? teamRes.data[0].id : teamRes.data[1].id, user_id: item.id || item.first_name } }))
  //                             .select()
  //                         await supabase
  //                             .from('Games')
  //                             .insert({ home_team_id: teamRes.data[0].id, away_team_id: teamRes.data[1].id, referee: refree })
  //                             .select()
  //                     })
  //             })
  //     }
  //     if (newHomeTeam.name && newAwayTeam.name) {

  //     }

  // }

  const handleCreate = async () => {
    const { data: homeTeamData, error: homeTeamError } = await supabase
      .from("teams")
      .insert({ name: homeTeamName })
      .select();

    if (homeTeamError) throw homeTeamError;
    const homeTeamId = homeTeamData[0].id;

    // Create Away Team
    const { data: awayTeamData, error: awayTeamError } = await supabase
      .from("teams")
      .insert({ name: awayTeamName })
      .select();

    if (awayTeamError) throw awayTeamError;
    const awayTeamId = awayTeamData[0].id;

    const { data: gameData, error: gameError } = await supabase
      .from("Games")
      .insert({ home_team_id: homeTeamId, away_team_id: awayTeamId, referee: appUser?.user_id }) // set refree to creator
      .select();

    if (gameError) throw gameError;

    console.log(gameData);
  };

  function formatTimestamp(timestamp: string) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const date = new Date(timestamp);
    const dayOfWeek = days[date.getUTCDay()];
    const dayOfMonth = date.getUTCDate();
    const month = months[date.getUTCMonth()];

    return `${dayOfWeek}, ${dayOfMonth} ${month}`;
  }

  // const filter = createFilterOptions<FilmOptionType>();
  return (
    <div className="p-4">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {games.map((game) => (
            <Grid key={game.id} item xs={12} md={6}>
              <Link href={`/games/${game.id}`}>
                <Card variant="outlined">
                  <CardActionArea>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <div className="flex-row md:w-9/12 w-10/12 mr-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              {/* <Typography variant="subtitle1" >
                        img
                    </Typography> */}
                              {game.home_team?.logo && (
                                <Image
                                  width={20}
                                  height={20}
                                  className=" mr-2"
                                  alt="Empty"
                                  src={game.home_team?.logo}
                                />
                              )}
                              <Typography variant="subtitle1">
                                {game.home_team?.name}
                              </Typography>
                            </div>
                            <Typography variant="subtitle2">
                              {game.home_final_score}
                            </Typography>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              {game.away_team?.logo && (
                                <Image
                                  width={20}
                                  height={20}
                                  className=" mr-2"
                                  alt="Empty"
                                  src={game.away_team?.logo}
                                />
                              )}

                              {/*  */}
                              <Typography variant="subtitle1">
                                {game.away_team?.name}
                              </Typography>
                            </div>
                            <Typography variant="subtitle2">
                              {game.away_final_score}
                            </Typography>
                          </div>
                        </div>

                        <Divider orientation="vertical" flexItem />
                        <div className="ml-2 md:w-4/12  w-3/12">
                          <Typography variant="caption" textAlign="center">
                            {formatDistance(
                              new Date(game.created_at),
                              new Date(),
                              { addSuffix: true }
                            )}
                          </Typography>
                          <br />
                          <Typography variant="caption">
                            {formatTimestamp(game.created_at)}
                          </Typography>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
      <div className="flex justify-center mt-6">
        <Button variant="outlined" onClick={handleClickOpen}>
          Create a new Game
        </Button>

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
                  // value={newGame.type}
                  // onChange={(e) => setNewGame({ ...newGame, type: e.target.value })}
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="pickup"
                    control={<Radio />}
                    label="Pickup"
                  />
                  {/* <FormControlLabel value="league" control={<Radio />} label="League Fixture" /> */}
                </RadioGroup>
                <h3 className="text-lg font-bold mb-2 mt-4">Home Team</h3>
                <TextField
                  id="outlined-basic"
                  sx={{ marginBottom: 2 }}
                  label="Home Team Name"
                  placeholder="Enter name for home team "
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setHomeTeamName(e.target.value)}
                />

                {/* <FormLabel id="home-team-name" className='block'>Home Team Players</FormLabel> <br /> */}

                {/*<Autocomplete
                                    // value={homeTeamPlayers}
                                    // onValueChange={(event, newInputValue) => {
                                    //     setHomeTeamPlayers(newInputValue);
                                    //   }}
                                    key='home'

                                    value={undefined}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            setHomeTeamPlayers(newValue)
                                        } else if (newValue && newValue.inputValue) {

                                            setHomeTeamPlayers(newValue.inputValue)
                                        } else {

                                            setHomeTeamPlayers(newValue.map(item => item.user_id || item.inputValue))

                                        }
                                    }}
                                    filterOptions={(options, params) => {
                                        const filtered = filter(options, params);

                                        const { inputValue } = params;
                                        // Suggest the creation of a new value
                                        const isExisting = options.some((option) => `${option.first_name}`.toLowerCase().includes(inputValue.toLowerCase()));
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
                                    options={players.filter(player => ![...awayTeamPlayers, refree].includes(player.user_id))}

                                    renderInput={(params, idx) => (
                                        <TextField
                                            key={idx}

                                            {...params}
                                            variant="standard"
                                            label="Home Team Players"
                                            placeholder="Home players"
                                        />

                                    )}
                                />*/}

                {/* AWAY TEAM  */}
                <h3 className="text-lg font-bold mb-2 mt-8">Away Teams</h3>

                <TextField
                  id="outlined-basic"
                  sx={{ marginBottom: 2 }}
                  label="Away Team Name"
                  placeholder="Enter name for away team "
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setAwayTeamName(e.target.value)}
                />

                {/* <Autocomplete
                                    // value={awayTeamPlayers}
                                    key='away'
                                    value={undefined}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            setAwayTeamPlayers(newValue.map(item => item.user_id))
                                        } else if (newValue && newValue.inputValue) {
                                            setAwayTeamPlayers(newValue.inputValue.map(item => item.user_id))
                                        } else {
                                            setAwayTeamPlayers(newValue.map(item => item.user_id || item.inputValue))

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
                                    options={players.filter(player => ![...homeTeamPlayers, refree].includes(player.user_id))}

                                    renderInput={(params, idx) => (
                                        <TextField
                                            {...params}
                                            key={idx}
                                            variant="standard"
                                            label="Away Team Players"
                                            placeholder="Away players"
                                        // onKeyDown={handleClickEnter}
                                        />

                                    )}
                                /> */}

                <h3 className="text-lg font-bold mb-2 mt-8">Choose Refree</h3>

                {/* <Autocomplete
                                    key='ref'
                                    value={undefined}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            setRefree(newValue)
                                        } else if (newValue && newValue.inputValue) {

                                            setRefree(newValue.inputValue)
                                        } else {

                                            console.log(newValue)
                                            setRefree(newValue?.user_id)

                                        }
                                    }}
                                    disablePortal
                                    id="combo-box-demo"
                                    options={players.filter(player => ![...homeTeamPlayers, ...awayTeamPlayers].includes(player.user_id))}
                                    getOptionLabel={(option) => option?.first_name}
                                    sx={{ width: 300, marginTop: 4 }}
                                    renderInput={(params, idx) => <TextField key={idx} {...params} label="Refree" />}
                                /> */}
              </div>

              {/* comment out league game logic for now */}
              {/* {newGame.type == "league" && (
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
                            )} */}

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
  );
}
