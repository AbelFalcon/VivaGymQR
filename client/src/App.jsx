import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";

function App() {

  // TODO: Separar logica y componentes

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const clientTokenRef = useRef(null);
  const clientTokenExpiryRef = useRef(0);

  const generateQR = async () => {
    if (!email || !password) {
      setError("Faltan email o contraseña");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    // Hay que darle una vuelta. No es muy eficiente.
    try {
      const now = Math.floor(Date.now() / 1000);
      let clientToken;

      if (
        clientTokenRef.current &&
        clientTokenExpiryRef.current > now + 60
      ) {
        clientToken = clientTokenRef.current;
      } else {
        const clientRes = await fetch("/api/token", { method: "POST" });
        const { access_token, expires_at } = await clientRes.json();

        if (!access_token || !expires_at) {
          throw new Error("Token del cliente no recibido o incompleto");
        }

        clientToken = access_token;
        clientTokenRef.current = access_token;
        clientTokenExpiryRef.current = expires_at;
      }

      const userRes = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, clientToken }),
      });

      const loginData = await userRes.json();
      if (!loginData.access_token) throw new Error("Login fallido");

      const userToken = loginData.access_token;

      const qrRes = await fetch("/api/qr", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const qrText = await qrRes.text();
      const cleanQR = qrText.replace(/"/g, "");

      setQrCode(cleanQR);
      setSuccess(true);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setEmail("");
    setPassword("");
    setQrCode("");
    setError("");
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 space-y-8 transition-all duration-300">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#fd5000]">VivaGym QR</h1>
        <p className="text-sm text-gray-400">Sin rastreo. Sin anuncios. Solo tu QR.</p>
      </div>

      {!success ? (
        <form
          className="w-full max-w-md space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            generateQR();
          }}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm mb-1 text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm mb-1 text-gray-300">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="********"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <p className="text-xs text-gray-500 text-center italic">
            Tus credenciales se usan solo para generar el QR. No se almacenan ni pasan por ningún servidor externo a VivaGym.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Generando..." : "Generar QR"}
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center space-y-6">
          <p className="text-green-400 font-medium text-lg">¡QR generado!</p>
          <div className="bg-white p-4 rounded shadow-md">
            <QRCodeCanvas value={qrCode} size={220} />
          </div>
          <p className="text-sm text-gray-300 break-all max-w-xs text-center">{qrCode}</p>

          {/* TODO: Agregar la posibilidad de regerar QR sin volver a iniciar sesion */}
          <button
            onClick={reset}
            className="mt-4 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded transition"
          >
            Generar otro
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
