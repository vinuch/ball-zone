// @ts-nocheck
"use client";

import {
  AppBar,
  Autocomplete,
  AutocompleteRenderInputParams,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MobileStepper,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  createFilterOptions,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import styled from "@emotion/styled";
// import SelectPlayer from './components/select-player';
import React, { useCallback, useEffect, useState } from "react";

import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { blue } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import supabase from "@/lib/supabase";
import { usePathname, useSearchParams } from "next/navigation";
import { Game, Player } from "../../leagues/[league-id]/page";
import { SnackbarProvider } from "notistack";
import {
  ArrowBackIos,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Logout,
  Notifications,
  Pause,
  PlayArrow,
  Stop,
} from "@mui/icons-material";
import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import Timer from "./components/Timer";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Link from "next/link";
import LoadingButton from "@mui/lab/LoadingButton";

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
const emails = ["username@gmail.com", "user02@gmail.com"];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  homePlayers: any;
  awayPlayers: any;
  team: string;
  activeTeamId: string;
  onClose: (value: string | null) => void;
}

export interface NextSetDialogProps {
  open: boolean;
  onclose: (val: string | null) => void;
  winner: any;
}

function SimpleDialog(props: SimpleDialogProps) {
  const {
    onClose,
    onAddPlayer,
    selectedValue,
    open,
    homePlayers,
    awayPlayers,
    team,
    activeTeamId,
  } = props;
  const [open2, setOpen2] = useState(false);
  const [homeTeamPlayers, setHomeTeamPlayers] = React.useState(homePlayers);
  const [awayTeamPlayers, setAwayTeamPlayers] = React.useState(awayPlayers);
  // const [players, setPlayers] = React.useState<[]>([]);

  // useEffect(() => {
  //     const fetchPlayers = async () => {
  //         let { data: players } = await supabase
  //             .from('Users')
  //             .select(`
  //             *

  //           `)
  //         // console.log(players?.map(item => item.user))

  //         setPlayers(players?.map(item => item))
  //     }

  //     fetchPlayers()

  // }, [])
  const handleClose = () => {
    onClose(null);
  };
  const handleCloseAddPlayer = () => {
    setOpen2(false);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  let playerList = [];
  if (team == "home") {
    playerList = homePlayers;
  } else if (team == "away") {
    playerList = awayPlayers;
  }

  function handleAddPlayerClick() {
    setOpen2(true);
  }

  const [value, setValue] = useState<string[]>([]);
  const [addPlayerLoading, setSddPlayerLoading] = useState<boolean>(false);

  const handleAddPlayers = async () => {
    // Create Users for the newly added ones
    setSddPlayerLoading(true)
    const { data: userData, error: userError } = await supabase
      .from("Users")
      .insert(value.map((item) => ({ first_name: item })))
      .select();

    if (userError) throw userError;

    // Create Users for the newly added ones
    const { data: team_userData, error: team_userError } = await supabase
      .from("team_user")
      .insert(
        userData.map((item) => ({
          user_id: item.user_id,
          team_id: activeTeamId,
        }))
      )
      .select();

      setSddPlayerLoading(false)
      onAddPlayer()
      handleCloseAddPlayer(null)
    if (team_userError) throw team_userError;
  };

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
              <ListItemText primary={`${player.player.first_name} `} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disableGutters key="new">
          <ListItemButton onClick={() => handleAddPlayerClick()}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PlusIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`Add Player`} />
          </ListItemButton>
        </ListItem>
        <Dialog
          fullWidth
          maxWidth="xs"
          onClose={handleCloseAddPlayer}
          open={open2}
        >
          <DialogTitle>Add player</DialogTitle>
          <div className="p-4">
            <Autocomplete
              value={value}
              key="away"
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              freeSolo
              selectOnFocus
              clearOnBlur
              multiple
              handleHomeEndKeys
              id="tags-standard"
              options={[]}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      variant="outlined"
                      label={option}
                      {...tagProps}
                    />
                  );
                })
              }
              renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Away Team Players"
                  placeholder="Away players"
                  helperText="Press 'Enter' to add multiple values"
                  // onKeyDown={handleClickEnter}
                />
              )}
            />
            <div className="flex justify-end">
              {/* <Button
                variant="contained"
                className="bg-white my-4 "
                onClick={handleAddPlayers}
              >
                Add Players
              </Button> */}
              <LoadingButton
                loading={addPlayerLoading}
                type="submit"
                variant="contained"
                className="bg-black my-4 text-white "
                sx={{ mt: 3, mb: 2 }}
                onClick={handleAddPlayers}

            >
                Add Players
            </LoadingButton>
            </div>
          </div>
        </Dialog>
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
function AddTeamDialog(props) {
  const { onClose, open } = props;
  // const [homeTeamPlayers, setHomeTeamPlayers] = React.useState(homePlayers);
  // const [awayTeamPlayers, setAwayTeamPlayers] = React.useState(awayPlayers);
  // const [players, setPlayers] = React.useState<[]>([]);

  // useEffect(() => {
  //     const fetchPlayers = async () => {
  //         let { data: players } = await supabase
  //             .from('Users')
  //             .select(`
  //             *

  //           `)
  //         // console.log(players?.map(item => item.user))

  //         setPlayers(players?.map(item => item))
  //     }

  //     fetchPlayers()

  // }, [])
  const handleClose = () => {
    onClose(null);
  };

  const [teamName, setTeamName] = useState<string>("");
  const [value, setValue] = useState<string[]>([]);

  // const handleAddPlayers = async () => {

  //     // Create Users for the newly added ones
  //     const { data: userData, error: userError } = await supabase
  //     .from("Users")
  //     .insert(value.map(item => ({ first_name: item })))
  //     .select();

  //     if(userError) throw userError;

  //     // Create Users for the newly added ones
  //     const { data: team_userData, error: team_userError } = await supabase
  //     .from("team_user")
  //     .insert(userData.map(item => ({ user_id: item.user_id, team_id: activeTeamId })))
  //     .select();

  //     if(team_userError) throw team_userError;
  // }
  const pathname = usePathname();
  const gameId = pathname.split("/")[2];
  const handleAddTeam = async () => {
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .insert({ name: teamName, parent_game_id: gameId })
      .select();

    if (teamError) throw teamError;
    const teamId = teamData[0].id;

    // Create Users for the newly added ones
    const { data: userData, error: userError } = await supabase
      .from("Users")
      .insert(value.map((item) => ({ first_name: item })))
      .select();

    if (userError) throw userError;

    // Create Users for the newly added ones
    const { data: team_userData, error: team_userError } = await supabase
      .from("team_user")
      .insert(
        userData.map((item) => ({ user_id: item.user_id, team_id: teamId }))
      )
      .select();

    if (team_userError) throw team_userError;
  };

  return (
    <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open}>
      <DialogTitle>Add Team</DialogTitle>
      <div className="p-4">
        <TextField
          id="outlined-basic"
          sx={{ marginBottom: 2 }}
          label=" Team Name"
          placeholder="Enter name for home team "
          variant="outlined"
          fullWidth
          onChange={(e) => setTeamName(e.target.value)}
        />

        <Autocomplete
          value={value}
          key="away"
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          freeSolo
          selectOnFocus
          clearOnBlur
          multiple
          handleHomeEndKeys
          id="tags-standard"
          options={[]}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  variant="outlined"
                  label={option}
                  {...tagProps}
                />
              );
            })
          }
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField
              {...params}
              variant="standard"
              label="Team Players"
              placeholder="Team players"
              helperText="Press 'Enter' to add multiple values"
              // onKeyDown={handleClickEnter}
            />
          )}
        />
        <div className="flex justify-end">
          <Button
            variant="contained"
            className="bg-white my-4 "
            onClick={handleAddTeam}
          >
            Add team
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

function NextSetDialog(props: NextSetDialogProps) {
  const { open, onClose, winner, gameTeams, gameId, subGames } = props;

  const handleClose = () => {
    onClose(null);
  };
  const [homeActiveStep, setHomeActiveStep] = useState(0);
  const [awayActiveStep, setAwayActiveStep] = useState(0);
  const [home, setHome] = useState();
  const [away, setAway] = useState();
  const maxSteps = gameTeams.length;
  const [appUser, setAppUser] = React.useState(null);

  const handleNextHome = () => {
    setHomeActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBackHome = () => {
    setHomeActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };
  const handleNextAway = () => {
    setAwayActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBackAway = () => {
    setAwayActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  const handleCreateGame = async () => {
    // Determine the highest game_order value and add 1
    const nextGameOrder =
      subGames.length > 0
        ? Math.max(...subGames.map((game) => game.game_order)) + 1
        : 1; // Default to 1 if no subgames found

    const { data: gameData, error: gameError } = await supabase
      .from("Games")
      .insert({
        home_team_id: home?.id,
        away_team_id: away?.id,
        referee: appUser?.user_id,
        parent_game_id: gameId,
        game_order: nextGameOrder,
      }) // set refree to creator
      .select();

    if (gameError) throw gameError;
  };

  useEffect(() => {
    const fetchUser = async () => {
      //   setLoading(true);
      await supabase.auth.getSession().then(async ({ data: { session } }) => {
        // setAuthUserId(session?.user.id);
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
      //   setLoading(false);
    };

    fetchUser();
  }, []);
  return (
    <Dialog fullWidth onClose={handleClose} open={open}>
      <DialogTitle className="text-center">New Game (next set)</DialogTitle>
      <div className="flex flex-wrap w-full relative">
        <div className="w-full md:w-6/12 h-64 bg-black/50 p-4">
          <h3 className="text-center">Home: {home?.name}</h3>
          {/*<div className="flex h-48 w-full justify-center items-center bg-white/50">*/}

          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            <Paper
              square
              elevation={0}
              className="h-48"
              onClick={() =>
                away && away.id === gameTeams[homeActiveStep]?.id
                  ? null
                  : setHome(gameTeams[homeActiveStep])
              }
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  home && home.id === gameTeams[homeActiveStep]?.id
                    ? "6px solid #1976d2"
                    : "2px solid transparent",
                bgcolor: "background.default",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* <Box
          component="img"
          src={items[activeStep].image}
          alt={items[activeStep].label}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        /> */}
              <div className="flex h-full w-full bg-gray-600 justify-center items-center">
                <p>{gameTeams[homeActiveStep]?.name}</p>
              </div>
              <Typography
                variant="h6"
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  padding: "4px 8px",
                  borderRadius: 1,
                }}
              >
                {/* {items[activeStep].label} */}
              </Typography>
            </Paper>

            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={homeActiveStep}
              nextButton={
                <IconButton
                  size="small"
                  onClick={handleNextHome}
                  disabled={homeActiveStep === maxSteps - 1}
                >
                  <KeyboardArrowRight />
                </IconButton>
              }
              backButton={
                <IconButton
                  size="small"
                  onClick={handleBackHome}
                  disabled={homeActiveStep === 0}
                >
                  <KeyboardArrowLeft />
                </IconButton>
              }
              sx={{
                justifyContent: "center",
                position: "relative",
                top: -40,
                bgcolor: "transparent",
              }}
            />
          </Box>
          {/* </div> */}
        </div>
        <span
          className="md:absolute text-center md:text-left block  md:inline w-full text-5xl md:text-8xl text-red-600 z-30"
          style={{ left: "42%", top: "38%", fontFamily: "ds_digital_bold" }}
        >
          vs
        </span>
        <div className="w-full md:w-6/12 h-64 bg-white/50 p-4">
          <h3 className="text-center">Away: {away?.name} </h3>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            <Paper
              square
              elevation={0}
              className="h-48"
              onClick={() =>
                home && home.id === gameTeams[awayActiveStep]?.id
                  ? null
                  : setAway(gameTeams[awayActiveStep])
              }
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  away && away.id === gameTeams[awayActiveStep]?.id
                    ? "6px solid #1976d2"
                    : "2px solid transparent",
                bgcolor: "background.default",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* <Box
          component="img"
          src={items[activeStep].image}
          alt={items[activeStep].label}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        /> */}
              <div className="flex h-full w-full justify-center items-center">
                <p>{gameTeams[awayActiveStep]?.name}</p>
              </div>
              <Typography
                variant="h6"
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  padding: "4px 8px",
                  borderRadius: 1,
                }}
              >
                {/* {items[activeStep].label} */}
              </Typography>
            </Paper>

            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={awayActiveStep}
              nextButton={
                <IconButton
                  size="small"
                  onClick={handleNextAway}
                  disabled={awayActiveStep === maxSteps - 1}
                >
                  <KeyboardArrowRight />
                </IconButton>
              }
              backButton={
                <IconButton
                  size="small"
                  onClick={handleBackAway}
                  disabled={awayActiveStep === 0}
                >
                  <KeyboardArrowLeft />
                </IconButton>
              }
              sx={{
                justifyContent: "center",
                position: "relative",
                top: -12,
                bgcolor: "transparent",
              }}
            />
          </Box>
        </div>
      </div>

      <div className="flex justify-center my-3">
        <Button className="bg-white text-black" onClick={handleCreateGame}>
          Continue
        </Button>
      </div>
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
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const useGameDataFetcher = (
  setGame: any,
  setHomePlayers: any,
  setAwayPlayers: any,
  setHomePlayersStats: any,
  setAwayPlayersStats: any,
  setGameTeams: any,
  setSubGames: any,
  setAuthUserId: any,
  setAppUser: any,
  setLoading: any
) => {
  const fetchTeamPlayers = async (team_id: string) => {
    const { data: players } = await supabase
      .from("team_user")
      .select(`
        *,
        player:Users!user_id(*)
      `)
      .eq("team_id", team_id);
    return players;
  };

  const fetchTeamPlayersStats = async (game_id: string, team_id: string) => {
    const { data: players } = await supabase
      .from("game_player_stats")
      .select(`
        *,
        player:Users!user_id(*)
      `)
      .eq("game_id", game_id)
      .eq("team_id", team_id);
    return players;
  };

  const fetchGames = async (gameId: string) => {
    const { data } = await supabase
      .from("Games")
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*)
      `)
      .eq("id", gameId);

    if (data && data[0]) {
      const game = data[0];
      setGame(game);
      
      const [homePlayers, awayPlayers, homeStats, awayStats] = await Promise.all([
        fetchTeamPlayers(game.home_team_id),
        fetchTeamPlayers(game.away_team_id),
        fetchTeamPlayersStats(game.id, game.home_team_id),
        fetchTeamPlayersStats(game.id, game.away_team_id)
      ]);

      setHomePlayers(homePlayers);
      setAwayPlayers(awayPlayers);
      setHomePlayersStats(homeStats);
      setAwayPlayersStats(awayStats);
    }
  };

  const fetchGameTeams = async (parentGameId: string) => {
    const { data } = await supabase
      .from("teams")
      .select("*")
      .eq("parent_game_id", parentGameId);
    setGameTeams(data);
  };

  const fetchSubGames = async (parentGameId: string) => {
    const { data } = await supabase
      .from("Games")
      .select("*")
      .or([
        { parent_game_id: parentGameId },
        { id: parentGameId }
      ]);
    setSubGames(data);
  };

  const fetchUser = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user.id) {
      setAuthUserId(session.user.id);
      const { data } = await supabase
        .from("Users")
        .select()
        .eq("auth_user", session.user.id);

      if (!data?.length) {
        setAppUser(null);
      } else {
        setAppUser(data[0]);
      }
    }
    setLoading(false);
  };

  const fetchAllGameData = useCallback(async ({ parentGameId, gameId }: FetchGameDataParams) => {
    try {
      await fetchUser();
      await Promise.all([
        fetchGames(gameId),
        fetchGameTeams(parentGameId),
        fetchSubGames(parentGameId)
      ]);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  }, []);

  return { fetchAllGameData };
};


export default function Scoreboard() {
  // console.log(supabase)
  const [open, setOpen] = useState(false);
  const [nextSetOpen, setnextSetOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [homeFoulCount, setHomeFoulCount] = useState(0);
  const [awayFoulCount, setAwayFoulCount] = useState(0);
  const [game, setGame] = useState<Game | {}>();
  const [homePlayers, setHomePlayers] = useState<Player[] | []>([]);
  const [homePlayersStats, setHomePlayersStats] = useState<Player[] | []>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[] | []>([]);
  const [awayPlayersStats, setAwayPlayersStats] = useState<Player[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [authUserID, setAuthUserId] = useState();

  const [activeTeam, setActiveTeam] = useState("");
  const [activeTeamId, setActiveTeamId] = useState("");
  const [activeStat, setActiveStat] = useState({});

  const [selectedValue, setSelectedValue] = React.useState(emails[1]);
  const [appUser, setAppUser] = useState(null);

  const [winner, setWinner] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [addTeamOpen, setAddTeamOpen] = useState(false);
  const [gameTeams, setGameTeams] = useState([]);
  const [subGames, setSubGames] = useState([]);
  const [gameId, setGameId] = useState<string>();

  const searchParams = useSearchParams(); // Get the current search parameters
  const gameOrder = searchParams.get("game_order");

  const pathname = usePathname();

  const parentGameId = pathname.split("/")[2]


  useEffect(() => {
    const getGame = async () => {
      let parentGameId = pathname.split("/")[2];
      let { data } = await supabase
        .from("Games")
        .select("*")
        .or(`parent_game_id.eq.${parentGameId},id.eq.${parentGameId}`)
        .eq("game_order", gameOrder || 1);

      setGameId(data[0].id);
    };
    if (gameOrder) {
    } else {
      setGameId(pathname.split("/")[2]);
    }

    getGame();
  }, [gameOrder]);

  useEffect(() => {
    if (game && isFinished) {
      // console.log(game, home_ongoing_score(), away_ongoing_score());
      if (home_ongoing_score() > away_ongoing_score()) {
        setWinner(game.home_team);
      }
      if (away_ongoing_score() > home_ongoing_score()) {
        setWinner(game.away_team);
      }
      console.log(winner);
    }
  }, [isFinished]);

  const router = useRouter();

  const home_ongoing_score = () => {
    return homePlayersStats.reduce(
      (accumulator, stat) => accumulator + stat.points,
      0
    );
  };

  const away_ongoing_score = () => {
    return awayPlayersStats.reduce(
      (accumulator, stat) => accumulator + stat.points,
      0
    );
  };

  // const gameId = pathname.split('/')[2]
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
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const { fetchAllGameData } = useGameDataFetcher(
    setGame,
    setHomePlayers,
    setAwayPlayers,
    setHomePlayersStats,
    setAwayPlayersStats,
    setGameTeams,
    setSubGames,
    setAuthUserId,
    setAppUser,
    setLoading
  );

  useEffect(() => {
    fetchAllGameData({ parentGameId, gameId });
  }, [parentGameId, gameId, fetchAllGameData]);

  // Manual trigger function
  const refreshGameData = () => {
    fetchAllGameData({ parentGameId, gameId });
  };
  // useEffect(() => {
  //   const fetchTeamPlayers = async (team_id: string) => {
  //     let { data: players, error } = await supabase
  //       .from("team_user")

  //       .select(
  //         `
  //               *,
  //               player:Users!user_id(*)

  //             `
  //       )
  //       // .eq('game_id', game_id)
  //       .eq("team_id", team_id);

  //     return players;
  //   };
  //   const fetchTeamPlayersStats = async (game_id: string, team_id: string) => {
  //     console.log(game_id);
  //     let { data: players, error } = await supabase
  //       .from("game_player_stats")

  //       .select(
  //         `
  //               *,
  //               player:Users!user_id(*)
  //             `
  //       )
  //       .eq("game_id", game_id)
  //       .eq("team_id", team_id);

  //     return players;
  //   };
  //   // fetch game
  //   const fetchGames = async () => {
  //     await supabase
  //       .from("Games")
  //       .select(
  //         `
  //               *,
  //               home_team:teams!home_team_id(*),
  //               away_team:teams!away_team_id(*)

  //             `
  //       )
  //       .eq("id", gameId)
  //       .then((res) => {
  //           if(res.data){
  //               let game = res.data![0];
  //               setGame(game);
  //               fetchTeamPlayers(game.home_team_id).then((res) =>
  //                 setHomePlayers(res)
  //               );
  //               fetchTeamPlayers(game.away_team_id).then((res) =>
  //                 setAwayPlayers(res)
  //               );
      
  //               fetchTeamPlayersStats(game.id, game.home_team_id).then((res) =>
  //                 setHomePlayersStats(res)
  //               );
  //               fetchTeamPlayersStats(game.id, game.away_team_id).then((res) =>
  //                 setAwayPlayersStats(res)
  //               );
  //           }
         
  //       });

  //     // setGame(Games![0])
  //   };

  //   // fetch game teams
  //   const fetchGameTeams = async () => {
  //     let { data } = await supabase
  //       .from("teams")
  //       .select("*")
  //       .eq("parent_game_id", parentGameId);

  //     console.log(data, "game teams");

  //     setGameTeams(data);
  //     // setGame(Games![0])
  //   };
  //   const fetchSubGames = async () => {
  //     let { data } = await supabase
  //       .from("Games")
  //       .select("*")
  //       .or(`parent_game_id.eq.${parentGameId},id.eq.${parentGameId}`);

  //     console.log(data, "sub games");

  //     setSubGames(data);
  //     // setGame(Games![0])
  //   };

  //   const fetchUser = async () => {
  //     setLoading(true);
  //     await supabase.auth.getSession().then(async ({ data: { session } }) => {
  //       setAuthUserId(session?.user.id);
  //       await supabase
  //         .from("Users")
  //         .select()
  //         .eq("auth_user", session?.user.id)
  //         .then((res) => {
  //           console.log(res);
  //           if (!res.data!.length) {
  //             setAppUser(null);
  //             return;
  //           }
  //           setAppUser(res.data![0]);
  //           console.log(res.data![0]);
  //           const data = res.data![0];
  //         });
  //     });
  //     setLoading(false);
  //   };
  //   fetchUser();

  //   // fetch game stats
  //   fetchGames();
  //   fetchGameTeams();
  //   fetchSubGames();
  // }, [parentGameId, gameId]);

  const addPoint = (points: number, player_id: string, league_id: string) => {};

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      white: {
        main: "#fff",
      },
    },
  });

  const handleClickOpen = (team: string, stat: string, incrementBy: number) => {
    setOpen(true);
    setActiveTeam(team);
    if (team === "home") {
      setActiveTeamId(game.home_team.id);
    } else if (team === "away") {
      setActiveTeamId(game.away_team.id);
    }
    setActiveStat({ stat, incrementBy });
  };

  const handleClose = async (player: any) => {
    setOpen(false);
    console.log(homePlayersStats);
    // setSelectedValue(value);

    //make api call

    // check if value is in game_player_stats
    if (activeTeam == "home") {
      if (player) {
        const playerStat =
          homePlayersStats.find((stat) => stat.player_id == player.user_id) ||
          null;
        console.log(player);
        if (playerStat) {
          const { data, error } = await supabase
            .from("game_player_stats")
            .update([
              {
                [activeStat.stat]:
                  playerStat[activeStat.stat] + activeStat.incrementBy,
                player_id: player.user_id,
                team_id: player.team_id,
                game_id: gameId,
                league_id: game!.league_id,
              },
            ])
            .eq("id", Number(playerStat.id))
            .select();

          if (data) {
            let updatedStat = data[0];
            if (updatedStat) {
              let _player = {
                ...homePlayersStats.find((item) => item.id == updatedStat.id),
                ...{ ...updatedStat, player: player.player },
              };
              setHomePlayersStats([
                ...homePlayersStats.filter(
                  (item) => item.id !== updatedStat.id
                ),
                _player,
              ]);
            }
          }
        } else {
          const { data, error } = await supabase
            .from("game_player_stats")
            .insert([
              {
                [activeStat.stat]:
                  (player[activeStat.stat] || 0) + activeStat.incrementBy,
                player_id: player.user_id,
                team_id: player.team_id,
                game_id: gameId,
                league_id: game!.league_id,
              },
            ])
            .select();

          if (data) {
            let updatedStat = data[0];
            if (updatedStat) {
              let _player = {
                ...homePlayersStats.find((item) => item.id == updatedStat.id),
                ...{ ...updatedStat, player: player.player },
              };
              setHomePlayersStats([
                ...homePlayersStats.filter(
                  (item) => item.id !== updatedStat.id
                ),
                _player,
              ]);
            }
          }
        }
      }
    } else if (activeTeam == "away") {
      if (player) {
        const playerStat =
          awayPlayersStats.find((stat) => stat.player_id == player.user_id) ||
          null;
        console.log(player);
        if (playerStat) {
          const { data, error } = await supabase
            .from("game_player_stats")
            .update([
              {
                [activeStat.stat]:
                  playerStat[activeStat.stat] + activeStat.incrementBy,
                player_id: player.user_id,
                team_id: player.team_id,
                game_id: gameId,
                league_id: game!.league_id,
              },
            ])
            .eq("id", Number(playerStat.id))
            .select();

          if (data) {
            let updatedStat = data[0];
            if (updatedStat) {
              let _player = {
                ...awayPlayersStats.find((item) => item.id == updatedStat.id),
                ...{ ...updatedStat, player: player.player },
              };
              setAwayPlayersStats([
                ...awayPlayersStats.filter(
                  (item) => item.id !== updatedStat.id
                ),
                _player,
              ]);
            }
          }
        } else {
          const { data, error } = await supabase
            .from("game_player_stats")
            .insert([
              {
                [activeStat.stat]:
                  (player[activeStat.stat] || 0) + activeStat.incrementBy,
                player_id: player.user_id,
                team_id: player.team_id,
                game_id: gameId,
                league_id: game!.league_id,
              },
            ])
            .select();

          if (data) {
            let updatedStat = data[0];
            if (updatedStat) {
              let _player = {
                ...awayPlayersStats.find((item) => item.id == updatedStat.id),
                ...{ ...updatedStat, player: player.player },
              };
              setAwayPlayersStats([
                ...awayPlayersStats.filter(
                  (item) => item.id !== updatedStat.id
                ),
                _player,
              ]);
            }
          }
        }
      }
    }
  };
  const handleCloseNextSet = () => {
    setnextSetOpen(false);
  };
  const logout = async () => {
    await supabase.auth.signOut();
    // router.push("/sign-in")
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [selectedGame, setSelectedGame] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  const handleGameChange = (event) => {
     if (event.target.value === 'add-game') {
    //   setIsFinished(true);
    //   setnextSetOpen(true);
    } else {
      // Find the selected game object
    //   const selectedGame = subGames.find((game) => game.id === event.target.value);
    //   if (selectedGame) {
        // Navigate to the new route with query param
        const url = new URL(window.location.href);
      url.searchParams.set('game_order', event.target.value);

      // Navigate to the constructed URL
      router.push(url.toString());
    //   }
    setSelectedGame(event.target.value);
    // Handle additional logic when a game is selected
  };
  }
  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
    // Handle additional logic when a team is selected
  };

  if (!game) {
    return (
      <div className="flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <SnackbarProvider>
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
                <IconButton color="inherit" onClick={() => router.back()}>
                  {" "}
                  <ArrowBackIos />
                </IconButton>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  <div className="truncate w-56">
                    <span>
                      {game?.home_team.name} vs {game?.away_team.name}{" "}
                    </span>
                  </div>
                </Typography>
                <IconButton color="inherit" onClick={() => logout()}>
                  {" "}
                  <Logout />
                </IconButton>
                <IconButton color="inherit">
                  {" "}
                  <Notifications />
                </IconButton>
              </Toolbar>
            </AppBar>
          </Box>

          <div className="bg-black min-h-screen h-full py-8">
            <div className="">
              <div className="w-full h-full flex justify-center">
                <div className="w-11/12 h-full overflow-hidden">
                  <Paper
                    elevation={3}
                    sx={{
                      display: "flex",
                      height: "auto",
                      flexWrap: "wrap",
                      "& > :not(style)": {
                        m: 1,
                        width: "100%",
                      },
                    }}
                  >
                    <div className="relative py-16">
                      {/* <div className="relative flex justify-between"> */}
                      <FormControl
                        variant="outlined"
                        className="absolute top-2 left-2"
                      >
                        <InputLabel id="game-select-label">
                          Select a Game
                        </InputLabel>
                        <Select
                          labelId="game-select-label"
                          value={selectedGame.id}
                          onChange={handleGameChange}
                          label="Select a Game"
                          className="w-40"
                        >
                          {/* <MenuItem value="" disabled>Select a Game</MenuItem> */}
                          {subGames && subGames.map((game) => (
                            // <Link
                            //   
                            //   href={{
                            //     pathname: pathname,
                            //     query: { game_order: game.game_order },
                            //   }}
                            //   passHref
                            // >
                              <MenuItem key={game.id} value={game.game_order}>
                                Game {game.game_order}
                              </MenuItem>
                            // </Link>
                          ))}
                          <MenuItem
                            value="add-game"
                            onClick={() => {
                              setIsFinished(true);
                              setnextSetOpen(true);
                            }}
                          >
                            Add Game
                          </MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl
                        variant="outlined"
                        className="absolute top-2 right-4"
                      >
                        <InputLabel id="team-select-label">Teams</InputLabel>
                        <Select
                          labelId="team-select-label"
                          value={"teams"}
                          onChange={handleTeamChange}
                          label="Select a Team"
                          className="w-40"
                        >
                          <MenuItem value="teams" disabled>
                            Teams
                          </MenuItem>
                          {gameTeams.map((team, idx) => (
                            <MenuItem key={team.id} value={team.id} disabled>
                              {team.name}
                            </MenuItem>
                          ))}
                          <MenuItem
                            value="add-team"
                            onClick={() => setAddTeamOpen(true)}
                          >
                            Add Team
                          </MenuItem>
                        </Select>
                      </FormControl>

                      {/* </div> */}
                      {/* <span className="bg-black/50 p-2 px-4 absolute -top-2 -left-2">Game 1</span>
                                            <span className="bg-black/50 p-2 px-4 absolute -top-2 right-0">Teams</span> */}
                      <Timer
                        toggleNextSetModal={setnextSetOpen}
                        setIsFinished={setIsFinished}
                        isFinished={isFinished}
                      />
                      <NextSetDialog
                        gameId={gameId}
                        subGames={subGames}
                        onClose={handleCloseNextSet}
                        open={nextSetOpen}
                        winner={winner}
                        gameTeams={gameTeams}
                      />
                      <div className="flex my-6 items-center justify-center flex-wrap w-full">
                        <div className="w-full my-6 md:w-5/12">
                          <p className="text-center text-3xl font-bold">
                            {home_ongoing_score()}
                          </p>
                          <p className="text-center text-slate-500 text-xl font-bold">
                            {game.home_team.name}
                          </p>
                          <p className="text-center text-sm font-light">Home</p>

                          {game?.referee == appUser?.user_id && (
                            <div className="my-6">
                              <Stack
                                spacing="1"
                                direction="row"
                                justifyContent="center"
                                sx={{ gap: 1 }}
                              >
                                <Button
                                  onClick={() =>
                                    handleClickOpen("home", "points", 1)
                                  }
                                  color="error"
                                  size="small"
                                  variant="outlined"
                                >
                                  +1
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleClickOpen("home", "points", 2)
                                  }
                                  color="error"
                                  size="small"
                                  variant="outlined"
                                >
                                  +2
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleClickOpen("home", "points", 3)
                                  }
                                  color="error"
                                  size="small"
                                  variant="outlined"
                                >
                                  +3
                                </Button>
                              </Stack>

                              <Stack
                                spacing="2"
                                direction="row"
                                sx={{ gap: 1 }}
                                justifyContent="center"
                                className="my-3"
                              >
                                <Button
                                  onClick={() =>
                                    handleClickOpen("home", "rebounds", 1)
                                  }
                                  color="error"
                                  sx={{ fontSize: 10 }}
                                  size="small"
                                  variant="outlined"
                                >
                                  rebound
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleClickOpen("home", "assists", 1)
                                  }
                                  color="error"
                                  sx={{ fontSize: 10 }}
                                  size="small"
                                  variant="outlined"
                                >
                                  assists
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleClickOpen("home", "blocks", 1)
                                  }
                                  color="error"
                                  sx={{ fontSize: 10 }}
                                  size="small"
                                  variant="outlined"
                                >
                                  block
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleClickOpen("home", "steals", 1)
                                  }
                                  color="error"
                                  sx={{ fontSize: 10 }}
                                  size="small"
                                  variant="outlined"
                                >
                                  steal
                                </Button>
                                {/* <Button onClick={() => handleClickOpen('home', 'fouls', 1)} color="error" sx={{ fontSize: 10 }} size="small" variant="outlined">
                                                                    foul
                                                                </Button> */}
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
                          )}
                        </div>
                        <p className="text-center w-full md:w-10 font-bold">
                          VS
                        </p>
                        <div className="w-full my-6 md:w-5/12">
                          <p className="text-center text-3xl font-bold">
                            {away_ongoing_score()}
                          </p>
                          <p className="text-center text-slate-500 text-xl font-bold">
                            {game.away_team.name}
                          </p>
                          <p className="text-center text-sm font-light">Away</p>

                          {game?.referee == appUser?.user_id && (
                            <div className="my-6">
                              <Stack
                                spacing="1"
                                direction="row"
                                justifyContent="center"
                                sx={{ gap: 1 }}
                              >
                                <Button
                                  onClick={() =>
                                    handleClickOpen("away", "points", 1)
                                  }
                                  color="error"
                                  sx={{ fontSize: 10 }}
                                  size="small"
                                  variant="outlined"
                                >
                                  +1
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleClickOpen("away", "points", 2)
                                  }
                                  color="error"
                                  sx={{ fontSize: 10 }}
                                  size="small"
                                  variant="outlined"
                                >
                                  +2
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleClickOpen("away", "points", 3)
                                  }
                                  color="error"
                                  sx={{ fontSize: 10 }}
                                  size="small"
                                  variant="outlined"
                                >
                                  +3
                                </Button>
                              </Stack>

                              <Stack
                                spacing="1"
                                direction="row"
                                justifyContent="center"
                                sx={{ gap: 1 }}
                                className="my-3"
                              >
                                <Button
                                  onClick={() =>
                                    handleClickOpen("away", "rebounds", 1)
                                  }
                                  color="error"
                                  sx={{ fontSize: 10 }}
                                  size="small"
                                  variant="outlined"
                                >
                                  rebound
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleClickOpen("away", "assists", 1)
                                  }
                                  color="error"
                                  sx={{ fontSize: 10 }}
                                  size="small"
                                  variant="outlined"
                                >
                                  assits
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleClickOpen("away", "blocks", 1)
                                  }
                                  color="error"
                                  sx={{ fontSize: 10 }}
                                  size="small"
                                  variant="outlined"
                                >
                                  block
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleClickOpen("away", "steals", 1)
                                  }
                                  color="error"
                                  sx={{ fontSize: 10 }}
                                  size="small"
                                  variant="outlined"
                                >
                                  steal
                                </Button>
                                {/* <Button onClick={() => handleClickOpen('away', 'fouls', 1)} color="error" sx={{ fontSize: 10 }} size="small" variant="outlined">
                                                                    foul
                                                                </Button> */}
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
                          )}
                        </div>
                      </div>
                      <div className="h-">
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                          <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="fullWidth"
                            aria-label="disabled tabs example"
                          >
                            <Tab label="Home" {...a11yProps(0)} />
                            <Tab label="Away" {...a11yProps(1)} />
                          </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0}>
                          <TableContainer component={Paper} elevation={0}>
                            <Table
                              sx={{ minWidth: 650 }}
                              aria-label="simple table"
                            >
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
                                {homePlayersStats &&
                                  homePlayersStats.map((row, idx) => (
                                    <TableRow
                                      key={idx}
                                      sx={{
                                        "&:last-child td, &:last-child th": {
                                          border: 0,
                                        },
                                      }}
                                    >
                                      <TableCell component="th" scope="row">
                                        {row.player.first_name}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.points || 0}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.rebounds || 0}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.assists || 0}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.blocks || 0}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.steals || 0}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.fouls || 0}
                                      </TableCell>
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
                            <Table
                              sx={{ minWidth: 650 }}
                              aria-label="simple table"
                            >
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

                                {awayPlayersStats &&
                                  awayPlayersStats.map((row, idx) => (
                                    <TableRow
                                      key={idx}
                                      sx={{
                                        "&:last-child td, &:last-child th": {
                                          border: 0,
                                        },
                                      }}
                                    >
                                      <TableCell component="th" scope="row">
                                        {row.player.first_name}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.points || 0}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.rebounds || 0}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.assists || 0}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.blocks || 0}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.steals || 0}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.fouls || 0}
                                      </TableCell>
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
                      activeTeamId={activeTeamId}
                      onAddPlayer={() =>  fetchAllGameData({ parentGameId, gameId })}
                      onClose={handleClose}
                    />
                    <AddTeamDialog
                      open={addTeamOpen}
                      onClose={() => setAddTeamOpen(false)}
                    />
                  </Paper>
                </div>
              </div>
            </div>
          </div>
          <Paper
            sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
            elevation={3}
          >
            <BottomNav />
          </Paper>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
