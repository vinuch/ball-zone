"use client";

import { createBrowserClient, createServerClient, type CookieOptions } from "@supabase/ssr";
import { EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createBrowserClient(supabaseUrl!, supabaseKey!);

export default supabase;

// export async function GET(request: Request) {
//     const { searchParams } = new URL(request.url)
//     const token_hash = searchParams.get('token_hash')
//     const type = searchParams.get('type') as EmailOtpType | null
//     const next = searchParams.get('next') ?? '/'
  
//     if (token_hash && type) {
//       const cookieStore = cookies()
//       const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//           cookies: {
//             get(name: string) {
//               return cookieStore.get(name)?.value
//             },
//             set(name: string, value: string, options: CookieOptions) {
//               cookieStore.set({ name, value, ...options })
//             },
//             remove(name: string, options: CookieOptions) {
//               cookieStore.delete({ name, ...options })
//             },
//           },
//         }
//       )
  
//       const { error } = await supabase.auth.verifyOtp({
//         type,
//         token_hash,
//       })
//       if (!error) {
//         return NextResponse.redirect(next)
//       }
//     }
  
//     // return the user to an error page with some instructions
//     return NextResponse.redirect('/auth/auth-code-error')
//   }

export async function getSession() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
