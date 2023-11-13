"use client"
import { AuthUser } from "@/lib/data";
import supabase from "@/lib/supabase";
import { Box, Button, Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import Link from '@mui/material/Link';

import { redirect } from "next/navigation";


export default function SignInForm() {


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });


        let user: AuthUser = {
            email: String(data.get('email')),
            password: String(data.get('password')),
        }

        await supabase.auth.signInWithPassword({ ...user });
        redirect('/profile')

    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
            />
            <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
            />
            <Button
                type="submit"
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
            >
                Sign In
            </Button>
            <Grid container>
                <Grid item xs>
                    <Link href="#" variant="body2">
                        Forgot password?
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/sign-up" variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
            </Grid>
        </Box>
    )
}