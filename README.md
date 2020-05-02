# Salon

https://salon.kunal.sh
A 2D teleconferencing app.

Hasura console: https://api.salon.kunal.sh/console

To get started, you will first need to edit `public/index.html` to set your API key.

See the section marked `IMPORTANT SETUP`, and change the placeholder `YOUR_API_KEY` to be the API key you were provided.

You can retrieve your API key by visiting [https://accounts.simplewebrtc.com](https://accounts.simplewebrtc.com).

## Running

1. `npm install`
2. Edit `public/index.html` as described above.
3. `npm start`
4. Go to [https://localhost:8080/](https://localhost:8080)

## Upcoming

- Video for each person hovers above their icon, and dissapears when out of proximity

* initials in each player's icon. copy over mutations from master.
* move around on mobile - joystick

* `transform-translate` is much more performance than `position: absolute`
