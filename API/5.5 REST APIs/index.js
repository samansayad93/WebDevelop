import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { rateLimit } from "express-rate-limit";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

app.use(limiter);

// HINTs: Use the axios documentation as well as the video lesson to help you.
// https://axios-http.com/docs/post_example
// Use the Secrets API documentation to figure out what each route expects and how to work with it.
// https://secrets-api.appbrewery.com/

const yourBearerToken = "f5b2758b-c003-410f-8b26-c3662190cd11";
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/get-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.get(API_URL + "/secrets/" + searchId, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response) });
  }
});

app.post("/post-secret", async (req, res) => {
  const secret = req.body.secret;
  const score = req.body.score;
  try{
    const result = await axios.post(API_URL + "/secrets",{
      secret: secret,
      score: score,
    },config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response) });
  }
});

app.post("/put-secret", async (req, res) => {
  const searchId = req.body.id;
  try{
    const result = await axios.put(API_URL + "/secrets/" + searchId,req.body,config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response) });
  }
});

app.post("/patch-secret", async (req, res) => {
  const searchId = req.body.id;
  try{
    const result = await axios.patch(API_URL + "/secrets/" + searchId,req.body,config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response) });
  }
});

app.post("/delete-secret", async (req, res) => {
  const searchId = req.body.id;
  try{
    const result = await axios.delete(API_URL + "/secrets/" + searchId,config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response) });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
