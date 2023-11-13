import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { load } from "https://deno.land/std@0.206.0/dotenv/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = "re_5XEUG5sT_6r9Sgjsmo3hQVTGqpygafYmU";

const handler = async (request: Request): Promise<Response> => {
  // const env = await load();



  const url = new URL(request.url)
  const email = url.searchParams.get("email");
  console.log(email)


  
    const authHeader = request.headers.get('Authorization')!
    console.log(authHeader, email)

  
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
      ...corsHeaders,
    },
    body: JSON.stringify({
      from: "Acme <onboarding@resend.dev>",
      to: [`${email}`],
      subject: "hello world",
      html: `<h2>Confirm your signup</h2>

            <p>Follow this link to confirm your user:</p>
            <p>
              <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email"
                >Confirm your email</a
              >
            </p>
              `,
    }),
  });


  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

serve(handler);
