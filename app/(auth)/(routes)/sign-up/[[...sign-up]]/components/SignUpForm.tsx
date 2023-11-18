"use client"
import supabase from "@/lib/supabase";
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, Link, Snackbar, TextField } from "@mui/material";
import { AuthUser } from "@/lib/data";
import { redirect, useRouter } from 'next/navigation'
import React, { SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CloseIcon from '@mui/icons-material/Close';

type IFormInput = {
    email: string
    password: string
}

export default function SignUpForm() {
    const [open, setOpen] = useState(false);

    const [snackMessage, setSnackMessage] = useState<SetStateAction<string>>('');
    const [snackSeverity, setSnackSeverity] = useState<SetStateAction<string>>('');
    const [loading, setloading] = useState(false)
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, } = useForm<IFormInput>()
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setloading(true)



        if (!data.email || !data.password) {
            return
        }

        let user: AuthUser = data


        await supabase.auth.signUp({ ...user, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback` } }).then((res) => {
            setloading(false)
            
            if (res.error) {
                setSnackSeverity('error')
                setSnackMessage(res.error?.message!)
                setOpen(true)
            } else {
                router.push('/sign-in')

            }

        }).catch(err => {
            console.log('hi')
        });



    };
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
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

    return (<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
        <TextField
            margin="normal"
            required
            {...register("email", { required: 'email is required' })}
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
        />
        <TextField
            margin="normal"
            {...register("password", { required: 'password is required and should be at least 6 characters', minLength: 6 })}
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
            Sign Up
        </LoadingButton>
        <Grid container>
            <Grid item xs>
                {/* <Link href="#" variant="body2">
          Forgot password?
        </Link> */}
            </Grid>
            <Grid item>
                <Link href="/sign-in" variant="body2">
                    {"Already have an account? Sign In"}
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
    </Box>)
}