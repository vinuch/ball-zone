"use client"

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Select, MenuItem, Grid } from '@mui/material';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import CircularProgress from '@mui/material/CircularProgress';
import { Game } from './[league-id]/page';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ImageUpload } from '@/components/ImageUpload';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { useSnackbar } from 'notistack';

interface League {
  id: string;
  name: string;
  logo: string;
  created_at: string;
}

const formSchema = z.object({
  league_name: z.string().min(1, {
    message: "first_name is required.",
  }),
  profile_img: z.string().min(1, {
    message: "profile image is required",
  })
})

export default function Leagues() {
  const [leagues, setLeagues] = useState<League[] | any[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [appUser, setAppUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [authUserID, setAuthUserId] = useState()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [games, setGames] = React.useState<Game[] | any[]>([]);
  const [newGame, setNewGame] = React.useState<Game>({});
  const [personName, setPersonName] = React.useState<string>('');
  const [homeTeam, setHomeTeam] = React.useState<string>('');
  const [awayTeam, setAwayTeam] = React.useState<string>('');
  // const supabase = createClientComponentClient()
  useEffect(() => {
    const fetchLeagues = async () => {
      let { data: Leagues, error } = await supabase
        .from('Leagues')
        .select('*')

      setLeagues(Leagues!)
    }
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
            const data = res.data![0];
          })
      })
      setLoading(false)


    }
    fetchUser()

    fetchLeagues()

    return () => {

    }
  }, [])

  // if (!leagues) {
  //   return <div className="flex justify-center items-center">
  //     <CircularProgress />
  //   </div>
  // }
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      league_name: "",
      profile_img: "",
    }
  });

  const isLoading = form.formState.isSubmitting;


  const onSubmit = async (values) => {
    console.log(values, 'aldjkf')
    const { league_name, profile_img } = values
    if (appUser) {
      const { data, error } = await supabase
        .from('Leagues')
        .insert([
          { name: league_name, logo: profile_img, created_by: appUser.user_id },
        ])
        .select()

      setAppUser(data![0])
      enqueueSnackbar('League Created', { variant: 'success' })
    }


  }


  return (
    <div className="p-3">
      <h2 className="mb-4">Active Leagues</h2>


      {leagues?.map(league => (
        <Link key={league.id} href={`/leagues/${league.id}`}>
          <Card className="my-4">
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {league.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Futo elites
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>

      ))}
      <div className=" mt-6">
        <div className="flex justify-center">
          <Button variant="outlined" onClick={handleClickOpen}>Create a new League</Button>

        </div>

        <Dialog open={open} onClose={handleClose}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-10">

              <DialogTitle>Create a new League </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please provide some details for the League you want to create
                </DialogContentText>
                <div className="w-full">

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                      <FormField name="profile_img" render={({ field }) => (
                        <FormItem className="space-y-4 my-4">
                          <FormLabel className="font-bold">League Logo</FormLabel><br />
                          <div className="flex flex-col items-center justify-center ">
                            <ImageUpload disabled={isLoading} onChange={field.onChange} value={field.value} />

                          </div>
                          <FormMessage />

                        </FormItem>
                      )} />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <FormField
                        name="league_name"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">League Name</FormLabel><br />
                            <FormControl className="w-full">
                              <Input
                                disabled={isLoading}
                                placeholder="eg: NUGA 2024"
                                className='w-full'
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Grid>

                  </Grid>

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
                <Button type="submit" onClick={() => console.log(form)}>Save Profile</Button>
              </DialogActions>
            </form>
          </Form>
        </Dialog>

      </div>


    </div>
  )
}
