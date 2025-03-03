# Final words and see you next time 👋

Starting December 26th, 2024 @ 18:00 (UTC+7), we will shut down the entire infrastructure of Starlight.

Why?

- We have finished the presentation for our "Web Application Development" course, the sole reason why I invested a lot in the project.
- After the presentation, there is not so much a growth of players, and maintaining a service that no one uses is not worth it.

What does this mean?

- The Starlight service hosted at `starlight.swyrin.id.vn`, is **_no longer available_** after the said time.
- The Starlight API service hosted at `cluster1.swyrin.id.vn`, is **_no longer available_** after the said time.
- You will have to self-host the entire game, along with replacing occurences, _including but not limited to_: [API URLs](https://github.com/search?q=repo%3Ateam-nameless%2Fstarlight%20+cluster1.swyrin.id.vn&type=code) and [Service URLs](https://github.com/search?q=repo%3Ateam-nameless%2Fstarlight+starlight.swyrin.id.vn&type=code).

Is there any future plan?

- Yes, we are rewriting the entire game, which you can track at the main branch! (You are here already.)
- For recruiter, or just wanderers, you can visit [the project before we started to rewrite it](https://github.com/team-nameless/starlight/tree/c317231d213dad168ffb18388db17ef227490cd3).  

After all, thank to Mr. Nguyen Trung Nghia for being so enthusiastic! And a warning happy new year from the Starlight team!

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

> Used to be something here, but we are rewriting the game!
