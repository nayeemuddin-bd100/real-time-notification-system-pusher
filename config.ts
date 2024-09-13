export const config = {
  mongodb: {
    uri:
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/realtime_notification_db",
  },
  pusher: {
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  },
  app: {
    name: "Realtime Notification App",
    version: "1.0.0",
  },
};
