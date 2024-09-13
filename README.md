# Real-time Notification System

Hey there! 👋 This project is a simple real-time notification system built with Next.js 14 and Pusher. It's perfect for anyone looking to add live updates to their web app without the hassle of setting up complex backend infrastructure.

## What's it all about?

Imagine you're building a social platform, a collaborative tool, or even a game. You need a way to instantly notify users about new activities or updates. That's where this project comes in handy!

Our app showcases a split-screen interface where users can send requests between two sides and see notifications pop up in real-time. It's a great starting point for all sorts of real-time features.

## How's it built?

We're using some cool tech here:

- Next.js 14 with App Router: For a modern, fast React framework
- TypeScript: Because who doesn't love some type safety?
- Pusher: The secret sauce for our real-time magic
- Tailwind CSS: For quick and pretty styling

## Project Structure

Here's a quick look at how the project is organized:

├── app/
│ ├── api/
│ │ └── notifications/
│ │ └── route.ts
│ └── page.tsx
├── components/
│ ├── User.tsx
│ └── NotificationIcon.tsx
├── lib/
│ └── pusher.ts
└── .env.local

```markdown
The `app/page.tsx` is where all the action happens. It's our main landing page with the split-screen UI and all the notification logic.

## How does it work?

1. Users can send requests from one side to the other.
2. When a request is sent, it shows up as a pending request on the receiving side.
3. The receiving side can accept the request, triggering a notification on the sending side.
4. All of this happens in real-time, no refreshing needed!

We use Pusher to handle the real-time communication. When something happens (like sending a request), we tell Pusher about it. Pusher then broadcasts this info to all connected clients, and voila! Instant updates.

## Want to try it out?

1. Clone this repo
2. Run `npm install` to get all the dependencies
3. Set up a Pusher account and create a new app
4. Copy your Pusher credentials into a `.env.local` file
5. Run `npm run dev` and open `http://localhost:3000`

Feel free to tinker with the code, add new features, or use this as a starting point for your own real-time projects. Happy coding! 🚀
```
