"use client"
import supabase from "@/lib/supabase";
import { Box, Button, Checkbox, FormControlLabel, Grid, Link, TextField } from "@mui/material";
import { AuthUser } from "@/lib/data";
import { redirect, useRouter } from 'next/navigation'

export default function SignUpForm() {
    const router = useRouter()
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: String(data.get('email')),
            password: String(data.get('password')),
        });

        if (!data.get('email') || !data.get('password')) {
            return
        }

        let user: AuthUser = {
            email: String(data.get('email')),
            password: String(data.get('password')),
        }


        await supabase.auth.signUp({ ...user, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback` } });
        router.push('/sign-in')

    };

    return (<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            Sign Up
        </Button>
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
    </Box>)
}