"use client"

import * as z from "zod";

import React, { use, useState } from "react";

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
const formSchema = z.object({
    first_name: z.string().min(1, {
        message: "first_name is required.",
    }),
    last_name: z.string().min(1, {
        message: "last name is required.",
    }),
    // position: z.string().optional(),
    // DOB: z.string().optional(),
    height: z.string(),
    weight: z.string(),
    profile_img: z.string().min(1, {
        message: "profile image is required",
    })
})


export default function Profile() {
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState(false)
    const [date, setDate] = React.useState<Date>()
    const [appUser, setAppUser] = useState(null)
    const [authUserID, setAuthUserId] = useState()
    const [loading, setLoading] = useState(false)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            position: "",
            height: "",
            weight: "",
            profile_img: "",
            DOB: ""
        }
    });


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
                        if(!res.data!.length) {setAppUser(null); return}
                        setAppUser(res.data![0]);
                        const data = res.data![0];
                        form.reset({ ...data, weight: String(data.weight), height: String(data.height) })
                    })
            })
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
        const { first_name, last_name, height, weight, profile_img } = values

        if (appUser) {
            const { data, error } = await supabase
                .from('Users')
                .update([
                    { first_name, last_name, height, weight, profile_img },
                ])
                .eq("user_id", appUser.user_id)
                .select()
            setAppUser(data![0])
            enqueueSnackbar('Profile Updated', { variant: 'success' })
            setEditing(false)
        } else {
            const { data, error } = await supabase
                .from('Users')
                .insert([
                    { first_name, last_name, height, weight, profile_img, auth_user: authUserID },
                ])
                .select()
            setAppUser(data![0])

            enqueueSnackbar('Profile Created', { variant: 'success' })

        }


    }


    if (!appUser && loading) {
        return <div className="flex justify-center items-center"><CircularProgress />
            </div>
    }
    return (
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <div>
                    {
                        appUser && !editing ? <div className="w">
                            <Typography variant="h6" gutterBottom>
                                Player Profile
                            </Typography>
                            <Grid container spacing={3} className="w-full">
                                <Grid item xs={12} sm={12}>
                                    <div className="flex justify-center items-center w-full">
                                        <div className="relative h-40 w-40">
                                            <Image
                                                fill
                                                alt="Uplaod"
                                                src={appUser.profile_img || "/placeholder.svg"}
                                                className="rounded-lg object-cover"
                                            />
                                        </div>
                                    </div>

                                </Grid>

                                <Grid item xs={6}>
                                    <p>First Name</p>
                                    <p>{appUser.first_name}</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>Last Name</p>
                                    <p>{appUser.last_name}</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>Height</p>
                                    <p>{appUser.height}</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p>Weight</p>
                                    <p>{appUser.weight}</p>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button type="submit" variant="outlined" className="w-full" onClick={() => setEditing(true)}>Edit Profile</Button>
                                </Grid>
                            </Grid>
                        </div> : <div className="mt-6">
                            <React.Fragment>
                                <Typography variant="h6" gutterBottom>
                                    {editing ? 'Edit' : 'Create'} Player Profile
                                </Typography>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-10">

                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={12}>
                                                <FormField name="profile_img" render={({ field }) => (
                                                    <FormItem className="flex flex-col items-center justify-center space-y-4">
                                                        <ImageUpload disabled={isLoading} onChange={field.onChange} value={field.value} />
                                                        <FormMessage />

                                                    </FormItem>
                                                )} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField
                                                    name="first_name"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>First Name</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="Lebron"
                                                                    {...field}
                                                                />
                                                            </FormControl>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormField
                                                    name="last_name"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Last Name</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    placeholder="James"
                                                                    {...field}
                                                                />
                                                            </FormControl>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <FormField
                                                    name="height"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Height</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    type="number"
                                                                    placeholder="6.4"
                                                                    {...field}
                                                                />
                                                            </FormControl>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormField
                                                    name="weight"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Weight</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    disabled={isLoading}
                                                                    type="number"
                                                                    placeholder="64"
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
            </Paper>
        </Container>

    )
}
