import express from "express";
import { rateLimit } from "express-rate-limit";

const app = express();
const port = 3000;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

app.use(limiter);

app.get("/", (req,res) => {
    res.send("<h1>Hello</h1>");
});

app.get("/contact", (req,res) => {
    res.send("<h1>Contact</h1>");
});

app.get("/about", (req,res) => {
    res.send("<h1>About</h1>");
});

app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
});