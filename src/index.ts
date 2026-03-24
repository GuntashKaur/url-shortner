import express, { Request, Response } from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const urlDatabase: { [key: string]: string } = {};

function generateShortCode(): string {
  return Math.random().toString(36).substring(2, 8);
}

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.post("/shorten", (req: Request, res: Response) => {
  const { originalUrl }: { originalUrl: string } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "URL is required" });
  }

  const shortCode = generateShortCode();
  urlDatabase[shortCode] = originalUrl;

  res.json({
    shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
  });
});

app.get("/:code", (req: Request<{ code: string }>, res: Response) => {
  const code = req.params.code;
  const originalUrl = urlDatabase[code];

  if (!originalUrl) {
    return res.status(404).send("URL not found");
  }

  res.redirect(originalUrl);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});