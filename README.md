# Final words and see you next time 👋

Starting December 26th, 2024 @ 18:00 (UTC+7), we will shut down the entire infrastructure of Starlight.

Why?

- We have finished the presentation for our "Web Application Development" course, the sole reason why I invested a lot in the project.
- After the presentation, there is not so much a growth of players, and maintaining a service that no one uses is not worth it.

What does this mean?

- The Starlight service hosted at `starlight.swyrin.id.vn`, is **_no longer available_** after the said time.
- The Starlight API service hosted at `cluster1.swyrin.id.vn`, is **_no longer available_** after the said time.
- You will have to self-host the entire game, along with replacing occurences, _including but not limited to_: [API URLs](https://github.com/search?q=repo%3Ateam-nameless%2Fstarlight%20cluster1.swyrin.id.vn&type=code) and [Service URLs](https://github.com/search?q=repo%3Ateam-nameless%2Fstarlight+starlight.swyrin.id.vn&type=code).

Is there any future plan?

- Yes, we are rewriting the entire game, which you can track at [PR #10](https://github.com/team-nameless/starlight/pull/10), and at [`stars-at-our-back` branch](https://github.com/team-nameless/starlight/tree/stars-at-our-back)

After all, thank to Mr. Nguyen Trung Nghia for being so enthusiastic!

---

# Project Starlight

- Welcome to our project: Starlight. This is a web-based VSRG (vertically-scrolling rhythm game) made with React,
  Vite, ASP.NET Core (+batteries from Microsoft) and Phaser.

- To perceive the best and our intended UX, make sure your screen is 1536x864 or 1920x1080 at 125%.

- Make sure your audio stack is low-latency enough:
  - Try to use ASIO stack, either ASIO4ALL or your driver's one is OK!
  - Make sure you don't stream via VGA or HDMI since it will cause buffer overhead on the browser, which affected the sound quality and latency.
    - This one issue is out of my control, which blew up the presentation. Apologize to Mr. Nguyen Trung Nghia and the team.

# Does it work?

- I honestly don't know, try out for yourself: `[LINK REMOVED]`
- If it really doesn't work, there is a self-hosting guide below.

# How do I self-host this?

It's a bit complicated. You have been warned.

- You need Node.js latest LTS (recommended) or lastest version (not supported first-party) for the front-end.
- You need .NET version 8 SDK for the backend.

## Steps to self-host

- Clone the entire project.
- Install packages.
  - Front-end: `npm install`
  - Back-end: `dotnet restore`
- Setting up:
  - Front-end: `npm run build`
  - Backend:
    - Create a `config.json` file with the following structure.
    ```json
    {
      "Email": {
        "Sender": "",
        "Auth": "",
        "Host": "",
        "Port": 587
      },
      "Database": {
        "Host": "",
        "Port": 6969,
        "User": "",
        "Password": "",
        "Database": ""
      }
    }
    ```
    where `Email` is your SMTP relay (i.e. SendGrid), `Database` is your MySQL configuration (_psst_ We support MariaDB, too _psst_).
    - Make sure CORS is correctly set up for your domain. (Hint: see `Program.cs` file)
    - Publish the package: `dotnet publish Starlight.Backend /p:EnvironmentName=Development -o build/`
- Running:
  - Front-end: There should be a `build` directory containing `index.html`, host that.
  - Back-end: There should be a `build` directory containing `Starlight.Backend[.*]`, use a Process Manager like PM2 to host that.
