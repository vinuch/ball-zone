import { EmailTemplate } from '@/components/EmailTemplate';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST( request: Request,
    { params }: { params: { chatId: string } }) {
  try {
    const {email} = await request.json();
    
    // const data = await resend.emails.send({
    //   from: 'Acme <onboarding@resend.dev>',
    //   to: [`${email}`],
    //   subject: 'Confirm Your Signup',
    //   react: EmailTemplate({ firstName: 'John' }),
    // });

    // return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
