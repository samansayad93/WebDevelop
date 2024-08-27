import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { rateLimit } from "express-rate-limit";
import { URL } from "url";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(limiter);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Function to validate the URL against a whitelist
 */
function validateUrl(url) {
  const allowedHosts = ["localhost"]; // Whitelist of allowed hosts
  try {
    const parsedUrl = new URL(url);
    if (!allowedHosts.includes(parsedUrl.hostname)) {
      throw new Error("Invalid host");
    }
    return parsedUrl.href;
  } catch (error) {
    throw new Error("Invalid URL");
  }
}

// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const validatedUrl = validateUrl(`${API_URL}/posts`);
    const response = await axios.get(validatedUrl);
    console.log(response);
    res.render("index.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Route to render the edit page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/edit/:id", async (req, res) => {
  try {
    const validatedUrl = validateUrl(`${API_URL}/posts/${req.params.id}`);
    const response = await axios.get(validatedUrl);
    console.log(response.data);
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const validatedUrl = validateUrl(`${API_URL}/posts`);
    const response = await axios.post(validatedUrl, req.body);
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Partially update a post
app.post("/api/posts/:id", async (req, res) => {
  console.log("called");
  try {
    const validatedUrl = validateUrl(`${API_URL}/posts/${req.params.id}`);
    const response = await axios.patch(validatedUrl, req.body);
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    const validatedUrl = validateUrl(`${API_URL}/posts/${req.params.id}`);
    await axios.delete(validatedUrl);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
