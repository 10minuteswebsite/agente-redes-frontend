"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const WEBHOOK = "https://n8n-qa.10minuteswebsite.net/webhook/seo-nuevo-tenant";
const OWNER_EMAIL = "mariodavila@gmail.com";

export default function NuevoUsuario() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ ok: boolean; mensaje: string } | null>(
    null
  );

  useEffect(() => {
    const sesionEmail = sessionStorage.getItem("email");
    if (sesionEmail === OWNER_EMAIL) {
      setAutorizado(true);
    } else {
      sessionStorage.setItem("redirect_to", "/nuevo-usuario");
      router.replace("/login");
    }
    setVerificando(false);
  }, [router]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setResultado(null);
    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          telefono,
          notas,
          honeypot,
          email_solicitante: sessionStorage.getItem("email"),
        }),
      });
      const data = await res.json();
      setResultado(data);
      if (data.ok) {
        setNombre("");
        setEmail("");
        setTelefono("");
        setNotas("");
      }
    } catch {
      setResultado({ ok: false, mensaje: "Error de conexión. Intenta de nuevo." });
    } finally {
      setEnviando(false);
    }
  }

  if (verificando || !autorizado) {
    return (
      <div className="flex h-screen items-center justify-center text-neutral-500">
        Verificando acceso...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <form
        onSubmit={enviar}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-neutral-200 p-6"
      >
        <h1 className="text-base font-medium text-neutral-800">
          Agregar nuevo usuario
        </h1>

        {/* honeypot: campo oculto, solo un bot lo llenaria */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
          aria-hidden="true"
        />

        <input
          required
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-500"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-500"
        />
        <input
          placeholder="Teléfono (opcional)"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-500"
        />
        <textarea
          placeholder="Notas (opcional)"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
          className="resize-none rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-500"
        />

        <button
          type="submit"
          disabled={enviando}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-40"
        >
          {enviando ? "Agregando..." : "Agregar usuario"}
        </button>

        {resultado && (
          <p
            className={`text-sm ${
              resultado.ok ? "text-green-600" : "text-red-600"
            }`}
          >
            {resultado.mensaje}
          </p>
        )}
      </form>
    </div>
  );
}
