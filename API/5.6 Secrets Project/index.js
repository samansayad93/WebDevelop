// HINTS:
// 1. Import express and axios
import express from "express";
import axios from "axios";
import { rateLimit } from "express-rate-limit";

// 2. Create an express app and set the port number.
const app = express();
const port = 3000;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

app.use(limiter);

// 3. Use the public folder for static files.
app.use(express.static("public"));

// 4. When the user goes to the home page it should render the index.ejs file.
// 5. Use axios to get a random secret and pass it to index.ejs to display the
// secret and the username of the secret.
app.get("/", async (req,res) => {
    const result = await axios.get("https://secrets-api.appbrewery.com/random");
    res.render("index.ejs",{
        secret: result.data.secret,
        user: result.data.username,
    });
});


// 6. Listen on your predefined port and start the server.
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});