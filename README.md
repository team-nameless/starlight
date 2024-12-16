# Project Starlight

- Welcome to our project: Starlight. This is a web-based VSRG (vertically-scrolling rhythm game) made with React, 
Vite, ASP.NET Core (+batteries from Microsoft) and a-particular-game-engine which I was strictly forbidden to disclose by the PM.

- To perceive the best and our intended UX, make sure your screen is 1536x864 or 1920x1080 at 125%.

# Does it work?

- I honestly don't know, try out for yourself: [https://starlight.swyrin.id.vn](https://starlight.swyrin.id.vn)
- If it really doesn't work, there is a self-hosting guide below.

# How do I self-host this?

It's a bit complicated. You have been warned.

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
    where `Email` is your SMTP relay (i.e. SendGrid), `Database` is your MySQL configuration (*psst* We support MariaDB, too *psst*).
    - Make sure CORS is correctly set up for your domain. (Hint: see `Program.cs` file) 
    - Publish the package: `dotnet publish Starlight.Backend /p:EnvironmentName=Development -o build/`
- Running:
  - Front-end: There should be a `build` directory containing `index.html`, host that.
  - Back-end: There should be a `build` directory containing `Starlight.Backend[.*]`, use a Process Manager like PM2 to host that.
