"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CHAT_WEBHOOK = "https://n8n-qa.10minuteswebsite.net/webhook/seo-chat";

type Mensaje = { rol: "user" | "agente"; texto: string };

const IMAGE_URL_PATTERN = /https?:\/\/\S+\.(?:png|jpg|jpeg|webp|gif)(?:\?\S*)?/i;

function renderConImagenes(texto: string) {
  const partes = texto.split(new RegExp(`(${IMAGE_URL_PATTERN.source})`, "gi"));
  return partes.map((parte, i) =>
    IMAGE_URL_PATTERN.test(parte) ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={i}
        src={parte}
        alt="Borrador generado"
        className="mt-2 max-w-full rounded-xl border border-neutral-200"
      />
    ) : (
      <span key={i}>{parte}</span>
    )
  );
}

export default function Chat() {
  const router = useRouter();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [verificando, setVerificando] = useState(true);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [esperandoBorradores, setEsperandoBorradores] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("tenant_id");
    if (!id) {
      router.replace("/login");
      return;
    }
    setTenantId(id);
    setVerificando(false);
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  // Limpiar polling cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  async function enviar(textoMsg?: string) {
    const mensaje = textoMsg || input.trim();
    if (!mensaje || !tenantId || cargando) return;

    // Si no es auto-polling, limpiar input y mostrar mensaje de usuario
    if (!textoMsg) {
      setMensajes((m) => [...m, { rol: "user", texto: mensaje }]);
      setInput("");
    }

    setCargando(true);
    try {
      const res = await fetch(CHAT_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: Number(tenantId), mensaje }),
      });
      const data = await res.json();
      const respuesta = data.respuesta || "Sin respuesta del agente.";

      // No mostrar mensajes de polling automático
      if (!textoMsg) {
        setMensajes((m) => [...m, { rol: "agente", texto: respuesta }]);
      }

      // Detectar si estamos generando borradores
      if (respuesta.includes("Iniciando generación")) {
        setEsperandoBorradores(true);
        // Auto-polling cada 3 segundos
        if (pollingRef.current) clearInterval(pollingRef.current);
        pollingRef.current = setInterval(() => {
          enviarAutoPoll();
        }, 3000);
      } else if (
        respuesta.includes("están listos") ||
        respuesta.includes("listo") ||
        respuesta.includes("pendiente") ||
        respuesta.includes("Aún no hay")
      ) {
        // Mostrar respuesta con borradores o estado de espera
        setMensajes((m) => [...m, { rol: "agente", texto: respuesta }]);

        // Si encontramos los borradores, parar polling
        if (respuesta.includes("están listos")) {
          setEsperandoBorradores(false);
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      }
    } catch (e) {
      if (!textoMsg) {
        setMensajes((m) => [
          ...m,
          { rol: "agente", texto: "Error de conexión. Intenta de nuevo." },
        ]);
      }
    } finally {
      setCargando(false);
    }
  }

  async function enviarAutoPoll() {
    // Auto-polling silencioso
    await enviar("¿Están listos los borradores?");
  }

  if (verificando || !tenantId) {
    return (
      <div className="flex h-screen items-center justify-center text-neutral-500">
        Verificando acceso...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
        <h1 className="text-sm font-medium text-neutral-700">
          Agente Redes SEO
        </h1>
        <Link
          href="/conectar-redes"
          className="text-sm text-neutral-500 hover:text-neutral-800"
        >
          Conectar redes
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {mensajes.length === 0 && (
            <div className="rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
              <p>
                <strong>Paso 2 de 2.</strong> Pégame el artículo de tu blog que quieres
                multiplicar en redes (título, resumen o link) y dime para cuáles
                quieres las publicaciones — o dime &quot;todas&quot;.
              </p>
              <p className="mt-1 text-neutral-400">
                ¿Ya tienes borradores generados? Pregúntame qué tienes pendiente, o
                pídeme que apruebe, edite o regenere alguno.
              </p>
            </div>
          )}
          {mensajes.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                m.rol === "user"
                  ? "self-end bg-neutral-900 text-white"
                  : "self-start bg-neutral-100 text-neutral-900"
              }`}
            >
              {renderConImagenes(m.texto)}
            </div>
          ))}
          {cargando && (
            <div className="self-start rounded-2xl bg-neutral-100 px-4 py-2 text-sm text-neutral-400">
              Escribiendo...
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-neutral-200 px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                enviar();
              }
            }}
            rows={1}
            placeholder="Escribe tu mensaje..."
            className="flex-1 resize-none rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-500"
          />
          <button
            onClick={enviar}
            disabled={cargando || !input.trim()}
            className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
