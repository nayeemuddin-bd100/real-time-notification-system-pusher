// app/api/notifications/route.ts
import pusher from "@/lib/pusher";
import { NextResponse } from "next/server";

let requestId = 0;

export async function POST(request: Request) {
  const body = await request.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { action, from, to, request: pendingRequest, side } = body;

  if (action === "sendRequest") {
    requestId++;
    const newRequest = { id: `req_${requestId}`, from: from.name };
    await pusher.trigger("notifications", "new-request", {
      side: to,
      request: newRequest,
    });
    return NextResponse.json({ message: "Request sent" });
  }

  if (action === "acceptRequest") {
    const notificationId = `notif_${Date.now()}`;
    const notification = {
      id: notificationId,
      message: `Your request to ${side} side was accepted`,
    };
    const oppositeSide = side === "left" ? "right" : "left";
    await pusher.trigger("notifications", "new-notification", {
      side: oppositeSide,
      notification,
    });
    return NextResponse.json({ message: "Request accepted" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
