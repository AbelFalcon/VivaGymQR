import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origen no permitido por CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// TODO: Aplicar Rate Limit para todos los endpoints
// TODO: Separar endpoints (?)

app.get('/', (req, res) => {
  res.send('Ok!')
})

app.post("/api/token", async (_, res) => {
  try {
    const response = await fetch("https://vivagym.myvitale.com/oauth/v2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "User-Agent": "okhttp/5.0.0-alpha.2",
      },
      body: JSON.stringify({
        client_id: process.env.VIVAGYM_CLIENT_ID,
        client_secret: process.env.VIVAGYM_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    });

    const data = await response.json();

    if (!data.access_token || !data.expires_in) {
      return res.status(500).json({ error: "Token inválido recibido desde VivaGym" });
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + data.expires_in;

    res.json({
      access_token: data.access_token,
      expires_in: data.expires_in,
      expires_at: expiresAt,
    });
  } catch (err) {
    console.error("Error token:", err);
    res.status(500).json({ error: "Error al obtener token del cliente" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password, clientToken } = req.body;

  const formData = new URLSearchParams();
  formData.append("access_token", clientToken);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("appName", "vivagym");

  try {
    const response = await fetch("https://vivagym.myvitale.com/api/v2.0/en/exerp/newAuth", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "okhttp/5.0.0-alpha.2",
      },
      body: formData,
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error login:", err);
    res.status(500).json({ error: "Error en autenticación de usuario" });
  }
});

app.get("/api/qr", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autorización requerido" });
  }

  const token = authHeader.substring(7);

  try {
    const response = await fetch("https://vivagym.myvitale.com/api/v2.0/exerp/qr", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "okhttp/5.0.0-alpha.2",
      },
    });

    const qrText = await response.text();
    res.send(qrText);
  } catch (err) {
    console.error("Error QR:", err);
    res.status(500).json({ error: "Error obteniendo código QR" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
