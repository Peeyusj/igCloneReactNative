import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
const http = httpRouter();
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }
    // check headers
    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");
    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }

// IMPORTANT CHANGE: Use TextDecoder instead of Buffer
    // Read the raw body as ArrayBuffer
    const bodyBuffer = await request.arrayBuffer();
    // Convert ArrayBuffer to string using TextDecoder
    const body = new TextDecoder().decode(bodyBuffer);
    const wh = new Webhook(webhookSecret);
    let evt: any;

    // verify webhook
    try {
      // Pass the RAW BODY STRING and the headers with their original names
      evt = wh.verify(body, { // <-- Use 'body' here, not 'payload'
        "svix-id": svix_id,
        "svix-signature": svix_signature,
        "svix-timestamp": svix_timestamp,
      }) as any;
    } catch (error) {
      console.error("Error verifying webhook:", error); // Use console.error for errors
      return new Response("Error occurred -- invalid signature", {
        status: 400,
      });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, first_name, last_name, image_url, email_addresses } =
        evt.data;
      const email = email_addresses[0].email_address;
      const name = `${first_name} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.user.createUser, {
          clerkId: id,
          fullname: name,
          email,
          image: image_url,
          username: email.split("@")[0],
        });
      } catch (error) {
        console.log("Error Creating Users", error);
        return new Response("Error Creating Users", {
          status: 400,
        });
      }
    }
    return new Response("Webhook processed successfully", {
      status: 200,
    });
  }),
});

export default http;