import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Load environment variables
dotenv.config();

// Initialize Firebase App & Firestore Database
let db: any = null;
try {
  const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(firebaseConfigPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));
    const firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    console.log("[Firebase] Backend Firestore client initialized successfully.");
  } else {
    console.warn("[Firebase] Config file firebase-applet-config.json not found.");
  }
} catch (err) {
  console.error("[Firebase] Initialization failed:", err);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON payloads
  app.use(express.json());

  // Serve the local image directory statically
  app.use("/image", express.static(path.join(process.cwd(), "image")));

  // --- API Routes ---

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Password Login endpoint (supports custom Firestore passwords & default fallback)
  app.post("/api/admin/login-password", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }

      const targetEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      // Verify authorized admin emails
      if (targetEmail !== "jeevanparivartan2@gmail.com" && targetEmail !== "diwaspal9@gmail.com") {
        return res.status(403).json({
          error: "Access denied: Unauthorized admin email address."
        });
      }

      // Check if custom password exists in Firestore under admin_users/{email}
      let correctPassword = "David@9082";
      if (db) {
        try {
          const userRef = doc(db, "admin_users", targetEmail);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.customPassword && typeof data.customPassword === "string" && data.customPassword.trim() !== "") {
              correctPassword = data.customPassword.trim();
              console.log(`[Auth] Using custom Firestore password for admin: ${targetEmail}`);
            }
          }
        } catch (dbErr) {
          console.error("[Firebase] Failed to fetch custom password from Firestore, falling back to default:", dbErr);
        }
      }

      // Verify password
      if (cleanPassword !== correctPassword) {
        return res.status(401).json({
          error: "Incorrect password. Please verify your credentials and try again."
        });
      }

      console.log(`[Auth] Password login successful for admin: ${targetEmail}`);
      return res.json({ success: true, userType: "admin" });
    } catch (err: any) {
      console.error("Password login error:", err);
      return res.status(500).json({ error: "Internal server error during login." });
    }
  });

  // --- Serve Frontend Application ---

  if (process.env.NODE_ENV !== "production") {
    // Mount Vite in middleware mode for local development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("[Vite] Dev middleware integrated successfully.");
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`[Production] Serving static files from: ${distPath}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server successfully listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
