import supabase from "./supabase";

export interface AuthUser {
  email: string;
  password: string;
}

export async function signup(d: AuthUser) {
  return await supabase.auth.signUp({...d, options: {emailRedirectTo: `${process.env}/sign-in`}});
}

export async function signin(d: AuthUser) {
  return await supabase.auth.signInWithPassword(d);
}

export async function getUser() {
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
