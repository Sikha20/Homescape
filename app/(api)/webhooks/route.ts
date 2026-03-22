import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  // Get the raw SIGNING_SECRET and decode it if needed
  const rawSigningSecret = process.env.SIGNING_SECRET;

  if (!rawSigningSecret) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Ensure the secret is properly formatted
  const SIGNING_SECRET = rawSigningSecret.trim();

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    await db.$transaction(async (tx:Prisma.TransactionClient) => {
      const user = await tx.user.create({
        data: {
          userId: id as string,
          name: `${payload.data.first_name} ${payload.data.last_name}`.trim() as string,
          profileUrl: payload.data.profile_image_url as string,
        },
      });

      await tx.emails.create({
        data: {
          userId: user.userId as string,
          email: payload.data.email_addresses[0].email_address as string,
        },
      });
    });
  } else if (eventType === "user.updated") {
    // await db.user.update({
    //   where: {
    //     userId: id as string,
    //   },
    //   data: {
    //     name: `${payload.data.first_name} ${payload.data.last_name}`.trim() as string,
    //     profileUrl: payload.data.profile_image_url as string,
    //   },
    // });
  } else if (eventType === "user.deleted") {
    await db.user.delete({
      where: {
        userId: id as string,
      },
    });
  }
  // ADD MORE EVENTS LIKE NEW EMAIL ADDED,
  else {
    console.log(`Unhandled event type: ${eventType}`);
    return new Response(
      `Webhook with event '${eventType}' received but was not handelled`,
      {
        status: 200,
      }
    );
  }

  console.log("Webhook payload:", body);

  return new Response("Webhook received", { status: 200 });
}
