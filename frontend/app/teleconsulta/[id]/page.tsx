"use client";

import {
  useEffect,
  useRef,
} from "react";

import { useParams } from "next/navigation";

export default function TeleconsultaPage() {
  const jitsiRef =
    useRef<HTMLDivElement>(null);

  const params =
    useParams();

  useEffect(() => {
    const loadJitsi = () => {
      const domain =
        "meet.jit.si";

      const options = {
        roomName: `MedFlow-${params.id}`,

        width: "100%",

        height: 800,

        parentNode:
          jitsiRef.current,

        userInfo: {
          displayName:
            "Dr. MedFlow",
        },

        configOverwrite: {
          startWithAudioMuted:
            false,

          startWithVideoMuted:
            false,
        },

        interfaceConfigOverwrite:
          {
            SHOW_JITSI_WATERMARK:
              false,
          },
      };

      // @ts-ignore
      new window.JitsiMeetExternalAPI(
        domain,
        options
      );
    };

    const script =
      document.createElement(
        "script"
      );

    script.src =
      "https://meet.jit.si/external_api.js";

    script.async = true;

    script.onload =
      loadJitsi;

    document.body.appendChild(
      script
    );
  }, [params.id]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#0f172a",
      }}
    >
      <div
        style={{
          padding: 20,
          color: "white",
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        Teleconsulta
      </div>

      <div
        ref={jitsiRef}
        style={{
          width: "100%",
          height: "calc(100vh - 80px)",
        }}
      />
    </div>
  );
}