import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { rateLimit } from "express-rate-limit";
import dotenv from "dotenv";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";
dotenv.config();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));

const yourBearerToken = process.env.BEARERTOKEN;
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

// Function to validate IDs
function isValidId(id) {
  // Ensure the ID only contains alphanumeric characters
  return /^[0-9]+$/.test(id);
}

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/get-secret", async (req, res) => {
  const searchId = req.body.id;

  if (!isValidId(searchId)) {
    return res.status(400).render("index.ejs", { content: "Invalid ID format" });
  }

  try {
    const result = await axios.get(`${API_URL}/secrets/${searchId}`, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(error.response?.status || 500).render("index.ejs", { content: "An error occurred while fetching the secret." });
  }
});

app.post("/post-secret", async (req, res) => {
  const { secret, score } = req.body;

  try {
    const result = await axios.post(`${API_URL}/secrets`, { secret, score }, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(error.response?.status || 500).render("index.ejs", { content: "An error occurred while posting the secret." });
  }
});

app.post("/put-secret", async (req, res) => {
  const searchId = req.body.id;

  if (!isValidId(searchId)) {
    return res.status(400).render("index.ejs", { content: "Invalid ID format" });
  }

  try {
    const result = await axios.put(`${API_URL}/secrets/${searchId}`, req.body, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(error.response?.status || 500).render("index.ejs", { content: "An error occurred while updating the secret." });
  }
});

app.post("/patch-secret", async (req, res) => {
  const searchId = req.body.id;

  if (!isValidId(searchId)) {
    return res.status(400).render("index.ejs", { content: "Invalid ID format" });
  }

  try {
    const result = await axios.patch(`${API_URL}/secrets/${searchId}`, req.body, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(error.response?.status || 500).render("index.ejs", { content: "An error occurred while patching the secret." });
  }
});

app.post("/delete-secret", async (req, res) => {
  const searchId = req.body.id;

  if (!isValidId(searchId)) {
    return res.status(400).render("index.ejs", { content: "Invalid ID format" });
  }

  try {
    const result = await axios.delete(`${API_URL}/secrets/${searchId}`, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(error.response?.status || 500).render("index.ejs", { content: "An error occurred while deleting the secret." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
