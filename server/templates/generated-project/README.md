# Generated TATKAL Project

This ZIP contains a deploy-ready full-stack booking application generated from the approved client design.

## Run locally

1. Install Node.js 18 or newer.
2. Start the app with `npm start` or `node server.js`.
3. Open `http://localhost:5000`.

## Included flow

- Login opens first.
- Register opens on its own page from the login screen.
- After login the user lands on the dashboard.
- Searching with `From` and `To` moves the customer to the next page.
- Seats, payment, and booking history are wired to the generated backend.

## Notes

- No frontend build step is required.
- Project data is stored in `data/app-data.json`.
- Change the port with the `PORT` environment variable if needed.
