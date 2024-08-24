import express from "express";
import { rateLimit } from "express-rate-limit";

const app = express();
const port = 3000;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(limiter);

app.get("/" , (req,res) => {
    const day = new Date().getTime();
    
    let type = "a weekday";
    let adv = "it's time for work hard";

    if(day === 4 || day === 5){
        type = "a weekend";
        adv = "it's time for have fun";
    }

    res.render("index.ejs",{
        daytype: type,
        advice: adv,
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});