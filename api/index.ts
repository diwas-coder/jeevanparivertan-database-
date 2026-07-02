import express from "express";
import https from "https";

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

    // Check if custom password exists in Firestore under admin_users/{email} via REST API using standard HTTPS module
    let correctPassword = targetEmail === "jeevanparivartan2@gmail.com" ? "Nashamukti@9082" : "David@9082";
    
    const projectId = "gen-lang-client-0753001234";
    const databaseId = "ai-studio-remix2jeevanpari-7214a054-6fbb-4e2d-a5a3-b89db870a572";
    
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/admin_users/${encodeURIComponent(targetEmail)}`;
      
      const docData = await new Promise<any>((resolve, reject) => {
        https.get(url, (response) => {
          let data = "";
          response.on("data", (chunk) => { data += chunk; });
          response.on("end", () => {
            if (response.statusCode === 200) {
              try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
            } else if (response.statusCode === 404) {
              resolve(null);
            } else {
              reject(new Error(`Firestore REST API returned status code ${response.statusCode}`));
            }
          });
        }).on("error", (err) => {
          reject(err);
        });
      });

      if (docData) {
        const customPasswordValue = docData?.fields?.customPassword?.stringValue;
        if (customPasswordValue && customPasswordValue.trim() !== "") {
          correctPassword = customPasswordValue.trim();
        }
      }
    } catch (dbErr) {
      console.error("[Firestore HTTPS] Failed to fetch custom password, falling back to default:", dbErr);
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
