import supabase from "./supabase";

export interface AuthUser {
  email: string;
  password: string;
}

export async function signup(d: AuthUser) {
  return await supabase.auth.signUp({...d, options: {emailRedirectTo: 'http://localhost:3000/auth/callback'}});
}

export async function signin(d: AuthUser) {
  return await supabase.auth.signInWithPassword(d);
}

export async function getUser() {
  console.log("hier");
  return await supabase.auth.getUser();
}

export async function verfifyUser(tokenHash: string) {
  console.log(tokenHash);
  return await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'email'});
}

export async function sendVerificationEmail(d: AuthUser) {
  await supabase.functions.invoke("email", {
    body: { email: d.email },
  });
}
