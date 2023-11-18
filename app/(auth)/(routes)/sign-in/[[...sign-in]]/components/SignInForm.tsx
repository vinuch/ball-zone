"use client"
import { AuthUser } from "@/lib/data";
import supabase from "@/lib/supabase";
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, Snackbar, TextField } from "@mui/material";
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';

import CloseIcon from '@mui/icons-material/Close';

import { useRouter } from "next/navigation";
import React, { SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type IFormInput = {
    email: string
    password: string
}

export default function SignInForm() {
    const [open, setOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState<SetStateAction<string>>('');
    const [snackSeverity, setSnackSeverity] = useState<SetStateAction<string>>('');
    const [loading, setloading] = useState(false)
    const router = useRouter()
    const { register, handleSubmit,   formState: { errors }, } = useForm<IFormInput>()

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        let user: AuthUser = data

        setloading(true)
        await supabase.auth.signInWithPassword({ ...user }).then(res => {
            setloading(false)
            if (res.error) {
                console.log(res.error.message)
                setSnackSeverity('error')
                setSnackMessage(res.error?.message!)
                setOpen(true)
            } else {
                router.push('/profile')

            }


        }
        ).catch(err => {
            console.log('hi')
        })
        try {



        } catch (error) {
        }


    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <TextField
                {...register("email", { required: 'email is required' })}
                margin="normal"
                required
                fullWidth
                id="email"

                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
            />
            <TextField
                {...register("password", { required: 'password is required', minLength: 6  })}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"

                autoComplete="current-password"
            />
        <p className="text-red-400 text-sm"> {errors.password && <span> password is required and should be at least 6 characters</span>}</p>

            {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
            /> */}
            <LoadingButton
                loading={loading}
                type="submit"
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
            >
                Sign In
            </LoadingButton>
            <Grid container>
                <Grid item xs>
                    {/* <Link href="#" variant="body2">
                        Forgot password?
                    </Link> */}
                </Grid>
                <Grid item>
                    <Link href="/sign-up" variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
            </Grid>
            <Snackbar
                open={open}
                severity={snackSeverity}
                autoHideDuration={6000}
                onClose={handleClose}
                message={snackMessage}
                action={action}
            />
        </Box>
    )
}