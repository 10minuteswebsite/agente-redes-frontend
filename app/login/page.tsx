"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SOLICITAR = "https://n8n-qa.10minuteswebsite.net/webhook/seo-solicitar-codigo";
const VERIFICAR = "https://n8n-qa.10minuteswebsite.net/webhook/seo-verificar-codigo";

export default function Login() {
  const router = useRouter();
  const [paso, setPaso] = useState<"email" | "codigo">("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function solicitarCodigo(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError("");
    try {
      const res = await fetch(SOLICITAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setPaso("codigo");
      } else {
        setError(data.mensaje || "Ese email no está autorizado.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  async function verificarCodigo(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError("");
    try {
      const res = await fetch(VERIFICAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem("tenant_id", String(data.tenant_id));
        sessionStorage.setItem("email", email.trim().toLowerCase());
        const destino = sessionStorage.getItem("redirect_to") || "/";
        sessionStorage.removeItem("redirect_to");
        router.push(destino);
      } else {
        setError(data.mensaje || "Código incorrecto.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <form
        onSubmit={paso === "email" ? solicitarCodigo : verificarCodigo}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-neutral-200 p-6"
      >
        <h1 className="text-base font-medium text-neutral-800">
          Agente Redes SEO
        </h1>

        {paso === "email" ? (
          <>
            <p className="text-sm text-neutral-500">
              Ingresa tu email para recibir un código de acceso.
            </p>
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-500"
            />
          </>
        ) : (
          <>
            <p className="text-sm text-neutral-500">
              Te enviamos un código a {email}. Escríbelo aquí.
            </p>
            <input
              required
              placeholder="Código de 6 dígitos"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-500"
            />
          </>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-40"
        >
          {enviando
            ? "Procesando..."
            : paso === "email"
            ? "Enviar código"
            : "Entrar"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
