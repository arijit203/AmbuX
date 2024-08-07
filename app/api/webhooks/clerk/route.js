import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
import { createUser } from '../../../../actions/user.action';
import { updateUser } from '../../../../actions/user.update';
 
import { NextResponse } from 'next/server';

export async function POST(req) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) ;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    });
  }

  // Do something with the payload
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(eventType)
  if (eventType === "user.created") {
    const { email_addresses, image_url, first_name, last_name, phone_numbers } = evt.data;
    console.log("Data: ",evt.data)
    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      photo: image_url,
      firstName: first_name,
      lastName: last_name,
      phone_no: phone_numbers[0]?.phone_number || null // Ensure the phone number is correctly accessed
    };

    console.log(user);

    const newUser = await createUser(user);

    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id
        }
      });
    }
    return NextResponse.json({ message: "New User created", user: newUser });
  }

  if (eventType === "user.updated") {
    const { email_addresses, image_url, first_name, last_name, phone_numbers } = evt.data;
    const updatedUser = {
      email: email_addresses[0]?.email_address || null,
      photo: image_url || null,
      first_name: first_name || null,
      last_name: last_name || null,
      phone_no: phone_numbers[0]?.phone_number || null
    };

    console.log(updatedUser);

    const user = await updateUser(id, updatedUser);

    if (user) {
      // Optionally update Clerk metadata if needed
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          updatedAt: new Date().toISOString()
        }
      });
    }
    return NextResponse.json({ message: "User updated", user: user });
  }

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  return new Response('', { status: 200 });
}
