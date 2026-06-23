"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const WEBHOOK = "https://n8n-qa.10minuteswebsite.net/webhook/seo-conectar-red";
const LISTAR_WEBHOOK =
  "https://n8n-qa.10minuteswebsite.net/webhook/seo-listar-redes-conectadas";
const DESCONECTAR_WEBHOOK =
  "https://n8n-qa.10minuteswebsite.net/webhook/seo-desconectar-red";

const REDES = [
  "X",
  "LinkedIn",
  "Reddit",
  "Facebook",
  "Pinterest",
  "Google Business Profile",
];

export default function ConectarRedes() {
  const router = useRouter();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [verificando, setVerificando] = useState(true);
  const [conectadas, setConectadas] = useState<string[]>([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [cargando, setCargando] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = sessionStorage.getItem("tenant_id");
    if (!id) {
      sessionStorage.setItem("redirect_to", "/conectar-redes");
      router.replace("/login");
      return;
    }
    setTenantId(id);
    setVerificando(false);

    fetch(LISTAR_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenant_id: Number(id) }),
    })
      .then((res) => res.json())
      .then((data) => setConectadas(data.conectadas || []))
      .catch(() => {})
      .finally(() => setCargandoLista(false));
  }, [router]);

  async function desconectar(red: string) {
    setCargando(red);
    setError("");
    try {
      const res = await fetch(DESCONECTAR_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: Number(tenantId), red }),
      });
      const data = await res.json();
      if (data.ok) {
        setConectadas((c) => c.filter((r) => r !== red));
      } else {
        setError(data.mensaje || "No se pudo desconectar.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setCargando(null);
    }
  }

  async function conectar(red: string) {
    setCargando(red);
    setError("");
    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: Number(tenantId), red }),
      });
      const data = await res.json();
      if (data.ok && data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        setError(data.mensaje || "No se pudo iniciar la conexión.");
        setCargando(null);
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setCargando(null);
    }
  }

  if (verificando || !tenantId) {
    return (
      <div className="flex h-screen items-center justify-center text-neutral-500">
        Verificando acceso...
      </div>
    );
  }

  const tieneAlguna = conectadas.length > 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="flex w-full max-w-md flex-col gap-3 rounded-2xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-medium text-neutral-800">
            Conecta tus redes sociales
          </h1>
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800">
            ← Chat
          </Link>
        </div>

        {!cargandoLista && (
          <p className="rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
            {tieneAlguna ? (
              <>
                Ya tienes <strong>{conectadas.join(", ")}</strong> conectado
                {conectadas.length > 1 ? "s" : ""}. Puedes agregar más aquí si quieres,
                o ir directo al chat a pegar tu artículo.
              </>
            ) : (
              <>
                <strong>Paso 1 de 2.</strong> Conecta aquí las redes donde quieres
                publicar. Cuando termines, ve al chat — ahí te pediremos el artículo
                que quieres multiplicar en esas redes.
              </>
            )}
          </p>
        )}
        <p className="text-sm text-neutral-500">
          Autoriza cada red con tu propia cuenta. Nunca vemos tu contraseña.
        </p>

        {REDES.map((red) => {
          const yaConectada = conectadas.includes(red);
          return (
            <div
              key={red}
              className="flex items-center justify-between rounded-xl border border-neutral-300 px-4 py-2 text-sm text-neutral-800"
            >
              <span>{red}</span>
              {yaConectada ? (
                <span className="flex items-center gap-2">
                  <span className="text-green-600">✓ Conectada</span>
                  <button
                    onClick={() => desconectar(red)}
                    disabled={cargando !== null}
                    className="text-red-500 hover:text-red-700 disabled:opacity-60"
                  >
                    {cargando === red ? "..." : "Desconectar"}
                  </button>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="text-red-500">✗ Desconectada</span>
                  <button
                    onClick={() => conectar(red)}
                    disabled={cargando !== null}
                    className="text-neutral-400 hover:text-neutral-800 disabled:opacity-60"
                  >
                    {cargando === red ? "Conectando..." : "Conectar →"}
                  </button>
                </span>
              )}
            </div>
          );
        })}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
