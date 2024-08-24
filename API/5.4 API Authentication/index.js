import express from "express";
import axios from "axios";
import { rateLimit } from "express-rate-limit";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

app.use(limiter);


const yourUsername = "aactivehunter";
const yourPassword = "password";
const yourAPIKey = "33ca50d8-c211-4052-9fb3-c07499ad7fbf";
const yourBearerToken = "f5b2758b-c003-410f-8b26-c3662190cd11";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  try{
    const response = await axios.get(API_URL + "random");
    const result = response.data;
    res.render("index.ejs",{content: JSON.stringify(result)});
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/basicAuth", async (req, res) => {
  try{
    const response = await axios.get(API_URL + "all?page=2",{
      auth:{
        username: yourUsername,
        password: yourPassword,
      }
    });
    const result = response.data;
    res.render("index.ejs",{content: JSON.stringify(result)});
  } catch (error) {
    res.status(404).send(error.message);
  } 
});

app.get("/apiKey", async (req, res) => {
  try{
    const response = await axios.get(API_URL + "filter",{
      params: {
        score: 5,
        apiKey: yourAPIKey,
      }
    });
    const result = response.data;
    res.render("index.ejs",{content: JSON.stringify(result)});
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/bearerToken", async (req, res) => {
  try{
    const response = await axios.get(API_URL + "secrets/42",{
      headers:{
        Authorization: `Bearer ${yourBearerToken}`,
      }
    });
    const result = response.data;
    res.render("index.ejs",{content: JSON.stringify(result)});
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
