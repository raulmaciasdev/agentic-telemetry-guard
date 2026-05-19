import express, { Request, Response, NextFunction } from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const app = express();

// 1. Configurar Express para que entienda cuerpos en formato JSON
app.use(express.json());

const server = new Server({
    name: "industrial-telemetry-mcp",
    version: "1.0.0"
}, {
    capabilities: { resources: {} }
});

// Almacenamos las sesiones activas de transporte SSE
let sseTransport: SSEServerTransport | null = null;

// 2. MIDDLEWARE DE SEGURIDAD: Validar la API Key desde variables de entorno
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Recuperamos la clave maestra definida en el sistema operativo o contenedor Docker
    const MASTER_API_KEY = process.env.MCP_API_KEY;

    if (!MASTER_API_KEY) {
        console.error("⚠️ CRÍTICO: La variable de entorno MCP_API_KEY no está configurada.");
        return res.status(500).json({ error: "Error de configuración interna del servidor" });
    }

    // Buscamos el token en la cabecera 'Authorization' (Formato estándar: Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Acceso denegado. Se requiere un token Bearer válido." });
    }

    const token = authHeader.split(" ")[1];

    // Validamos si el token del cliente coincide con nuestra clave maestra
    if (token !== MASTER_API_KEY) {
        return res.status(403).json({ error: "Acceso denegado. Clave API incorrecta." });
    }

    // Si todo está correcto, damos paso al siguiente endpoint
    next();
};

// 3. Aplicamos el middleware de seguridad de forma global a todos los endpoints del MCP
app.use(authMiddleware);

// Endpoint donde el cliente de IA inicia la conexión de escucha (la "sintoniza")
app.get("/sse", async (req, res) => {
    sseTransport = new SSEServerTransport("/messages", res);
    await server.connect(sseTransport);
});

// Endpoint donde el cliente envía las peticiones y comandos JSON
app.post("/messages", async (req, res) => {
    if (sseTransport) {
        await sseTransport.handleMessage(req, res);
    } else {
        res.status(400).send("No hay ninguna sesión SSE activa");
    }
});

// El servidor queda escuchando de forma permanente en un puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.error(`Servidor MCP web SEGURO activo en el puerto ${PORT}`);
});