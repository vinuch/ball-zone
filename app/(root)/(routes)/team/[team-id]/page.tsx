"use client"

import * as z from "zod";

import React, { use, useState } from "react";

import { usePathname } from 'next/navigation'
import supabase from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { redirect } from "next/navigation"
import { Button, Checkbox, CircularProgress, Container, FormControlLabel, Grid, Paper, TextField, Typography } from "@mui/material";
import { ImageUpload } from "@/components/ImageUpload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button as Button2 } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"
import Image from "next/image";
import { useSnackbar } from "notistack";

type Team = {
    name: string
    location: string
    logo: string
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "name is required.",
    }),
  
    // position: z.string().optional(),
    // DOB: z.string().optional(),
    location: z.string(),
    logo: z.string()
})


export default function TeamPage() {
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState(false)
    const [date, setDate] = React.useState<Date>()
    const [team, setTeam] = useState<Team>({})
    const [authUserID, setAuthUserId] = useState()
    const [loading, setLoading] = useState(false)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const pathname = usePathname();
    const teamId = pathname.split('/')[2]

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            logo: "",
            location: "",
        }
    });


    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            console.log(teamId)
            // if (user != 'profile') {
            //     await supabase
            //         .from('Users')
            //         .select()
            //         .or(`user_id.eq.${user}`).then(res => {
            //             console.log(res)
            //             if (!res.data!.length) { setAppUser(null); return }
            //             setAppUser(res.data![0]);
            //             const data = res.data![0];
            //             form.reset({ ...data, weight: String(data.weight), height: String(data.height) })
            //         })
            // } else {
            // await supabase.auth.getSession().then(async ({ data: { session } }) => {
            //     setAuthUserId(session?.user.id)
            await supabase
                .from('teams')
                .select()
                .eq("id", teamId).then(res => {
                    console.log(res)
                    if (!res.data!.length) { setTeam(null); return }
                    setTeam(res.data![0]);
                    const data = res.data![0];
                    form.reset(data)
                })
            // })
            // }

            setLoading(false)


        }
        fetchUser()

    }, [])



    const isLoading = form.formState.isSubmitting;


    const handleClickOpen = () => {
        setOpen(true);
    };
    // const router = useRouter()

    //     const { data: { user } } =  await getUser()

    // console.log(user)

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const { name, location, logo } = values

            const { data, error } = await supabase
                .from('teams')
                .update([
                    { name, location, logo},
                ])
                .eq("id", teamId)
                .select()
            setTeam(data![0])
            enqueueSnackbar('Profile Updated', { variant: 'success' })
            setEditing(false)
    


    }


    if (loading) {
        return <div className="flex justify-center items-center"><CircularProgress />
        </div>
    }
    return (
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <div>
                    {
                         !editing ? <div className="w">
                            <Typography variant="h6" gutterBottom>
                                Team Profile
                            </Typography>
                            <Grid container spacing={3} className="w-full">
                                <Grid item xs={12} sm={12}>
                                    <div className="flex justify-center items-center w-full">
                                        <div className="relative h-40 w-40">
                                            <Image
                                                fill
                                                alt="Uplaod"
                                                src={team.logo || "/placeholder.svg"}
                                                className="rounded-lg object-cover"
                                            />
                                        </div>
                                    </div>

                                </Grid>

                                <Grid item xs={12}>
                                    <p>Name</p>
                                    <p>{team.name}</p>
                                </Grid>
                                {/* <Grid item xs={6}>
                                    <p>Last Name</p>
                                    <p>{team.last_name}</p>
                                </Grid> */}
                                <Grid item xs={6}>
                                    <p>Location</p>
                                    <p>{team.location}</p>
                                </Grid>


                                <Grid item xs={12}>
                                    <Button type="submit" variant="outlined" className="w-full" onClick={() => setEditing(true)}>Edit Profile</Button>
                                </Grid>
                            </Grid>
                        </div> : <div className="mt-6">
                            <React.Fragment>
                                <Typography variant="h6" gutterBottom>
                                    {editing ? 'Edit' : 'Create'} Team Profile
                                </Typography>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-10">

                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={12}>
                                                <FormField name="logo" render={({ field }) => (
                                                    <FormItem className="flex flex-col items-center justify-center space-y-4">
                                                        <ImageUpload disabled={isLoading} onChange={field.onChange} value={field.value} />
                                                        <FormMessage />

                                                    </FormItem>
                                                )} />
                                            </Grid>
                                            <Grid item xs={12} sm={12}>
                                                <FormField
                                                    name="name"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Name</FormLabel>
                                                            <FormControl>
                                                                <Input disabled={isLoading} placeholder="Lakers" {...field} />
                                                            </FormControl>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </Grid>
                            

                                            <Grid item xs={12}>
                                                <FormField
                                                    name="location"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Location</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    type="text"
                                                                    placeholder="surulere, lagos"
                                                                    {...field}
                                                                />
                                                            </FormControl>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </Grid>
                                       


                                            {editing ? <>
                                                <Grid item xs={6}>
                                                    <Button onClickCapture={() => setEditing(false)} variant="outlined" color="error" className="w-full" onClick={handleClickOpen}>Cancel</Button>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Button type="submit" variant="outlined" className="w-full" onClick={() => console.log(form)}>Save Profile</Button>
                                                </Grid>
                                            </> : <Grid item xs={12}>
                                                <Button type="submit" variant="outlined" className="w-full" onClick={handleClickOpen}>Create a Player Profile</Button>
                                            </Grid>}

                                        </Grid>
                                    </form>
                                </Form>
                            </React.Fragment>

                        </div>
                    }

                </div>
                {/* {appUser && } */}
            </Paper>
        </Container>

    )
}
