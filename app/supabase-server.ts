"use client"

import { Database } from '@/types_db';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { createBrowserClient } from '@supabase/ssr'


// export const createBrowserSupabaseClient = cache(() =>
// createBrowserClient<Database>({ cookies })
// );

// export async function getSession() {
//   const supabase = createServerSupabaseClient();
//   try {
//     const {
//       data: { session }
//     } = await supabase.auth.getSession();
//     return session;
//   } catch (error) {
//     console.error('Error:', error);
//     return null;
//   }
// }
