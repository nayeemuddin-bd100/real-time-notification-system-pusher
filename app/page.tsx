// app/page.tsx
"use client";

import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type User = {
  id: string;
  name: string;
};

type Notification = {
  id: string;
  message: string;
};

type PendingRequest = {
  id: string;
  from: string;
};

const users: User[] = [
  { id: "1", name: "User 1" },
  { id: "2", name: "User 2" },
  { id: "3", name: "User 3" },
];

export default function Home() {
  const [leftNotifications, setLeftNotifications] = useState<Notification[]>(
    []
  );
  const [rightNotifications, setRightNotifications] = useState<Notification[]>(
    []
  );
  const [leftPendingRequests, setLeftPendingRequests] = useState<
    PendingRequest[]
  >([]);
  const [rightPendingRequests, setRightPendingRequests] = useState<
    PendingRequest[]
  >([]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("notifications");
    channel.bind(
      "new-notification",
      (data: { side: "left" | "right"; notification: Notification }) => {
        if (data.side === "left") {
          setLeftNotifications((prev) => [...prev, data.notification]);
        } else {
          setRightNotifications((prev) => [...prev, data.notification]);
        }
        toast(
          `${data.side.charAt(0).toUpperCase() + data.side.slice(1)} side: ${
            data.notification.message
          }`
        );
      }
    );

    channel.bind(
      "new-request",
      (data: { side: "left" | "right"; request: PendingRequest }) => {
        if (data.side === "left") {
          setLeftPendingRequests((prev) => [...prev, data.request]);
        } else {
          setRightPendingRequests((prev) => [...prev, data.request]);
        }
      }
    );

    return () => {
      pusher.unsubscribe("notifications");
    };
  }, []);

  const sendRequest = async (from: User, to: "left" | "right") => {
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sendRequest", from, to }),
    });

    if (response.ok) {
      console.log(`Request sent from ${from.name} to ${to} side`);
    }
  };

  const acceptRequest = async (
    request: PendingRequest,
    side: "left" | "right"
  ) => {
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "acceptRequest", request, side }),
    });

    if (response.ok) {
      console.log(`Request from ${request.from} accepted on ${side} side`);
      if (side === "left") {
        setLeftPendingRequests((prev) =>
          prev.filter((r) => r.id !== request.id)
        );
      } else {
        setRightPendingRequests((prev) =>
          prev.filter((r) => r.id !== request.id)
        );
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-6 flex justify-center items-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-10">
          Notification System
        </h1>
        <div className="flex justify-between">
          {/* Left Side */}
          <div className="w-1/2 pr-4">
            <h2 className="text-2xl font-semibold mb-4">Left Side</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">
                  Notifications ({leftNotifications.length})
                </h3>
                {leftNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-blue-100 p-2 rounded mb-2"
                  >
                    {notification.message}
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Pending Requests ({leftPendingRequests.length})
                </h3>
                {leftPendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-yellow-100 p-2 rounded mb-2 flex justify-between items-center"
                  >
                    <span>From: {request.from}</span>
                    <button
                      onClick={() => acceptRequest(request, "left")}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-1/2 pl-4">
            <h2 className="text-2xl font-semibold mb-4">Right Side</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">
                  Notifications ({rightNotifications.length})
                </h3>
                {rightNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-blue-100 p-2 rounded mb-2"
                  >
                    {notification.message}
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Pending Requests ({rightPendingRequests.length})
                </h3>
                {rightPendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-yellow-100 p-2 rounded mb-2 flex justify-between items-center"
                  >
                    <span>From: {request.from}</span>
                    <button
                      onClick={() => acceptRequest(request, "right")}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Send Requests</h2>
          <div className="flex justify-center space-x-4">
            {users.map((user) => (
              <div key={user.id} className="bg-white shadow rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">{user.name}</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => sendRequest(user, "left")}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Send to Left
                  </button>
                  <button
                    onClick={() => sendRequest(user, "right")}
                    className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  >
                    Send to Right
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
}
