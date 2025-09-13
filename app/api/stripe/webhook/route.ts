import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: Request) {
  const sig = headers().get('stripe-signature');
  if (!sig) return new NextResponse('Missing signature', { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new NextResponse('Invalid signature', { status: 400 });
  }

  // TODO: Idempotência (ex.: tabela webhook_events)
  // switch (event.type) { case 'checkout.session.completed': ... }

  return NextResponse.json({ received: true });
}
