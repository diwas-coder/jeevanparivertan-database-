import express from "express";
import firebaseConfig from "../firebase-applet-config.json";

const app = express();

app.use(express.json());

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

    // Check if custom password exists in Firestore under admin_users/{email} via REST API
    let correctPassword = targetEmail === "jeevanparivartan2@gmail.com" ? "Nashamukti@9082" : "David@9082";
    
    if (firebaseConfig && firebaseConfig.projectId && firebaseConfig.firestoreDatabaseId) {
      try {
        const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/admin_users/${encodeURIComponent(targetEmail)}`;
        const response = await fetch(url);
        if (response.ok) {
          const docData = await response.json();
          const customPasswordValue = docData?.fields?.customPassword?.stringValue;
          if (customPasswordValue && customPasswordValue.trim() !== "") {
            correctPassword = customPasswordValue.trim();
          }
        }
      } catch (dbErr) {
        console.error("[Firebase REST] Failed to fetch custom password from Firestore REST API, falling back to default:", dbErr);
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

export default app;
