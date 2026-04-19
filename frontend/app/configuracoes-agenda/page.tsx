"use client";

import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import { useRequireAuth } from "../../lib/auth";

const STORAGE_KEY = "medflow_agenda_config";

type AgendaConfig = {
  startHour: string;
  endHour: string;
  intervalMinutes: number;
};

const defaultConfig: AgendaConfig = {
  startHour: "08:00",
  endHour: "18:00",
  intervalMinutes: 30,
};

export default function ConfiguracoesAgendaPage() {
  const { ready } = useRequireAuth();
  const [startHour, setStartHour] = useState(defaultConfig.startHour);
  const [endHour, setEndHour] = useState(defaultConfig.endHour);
  const [intervalMinutes, setIntervalMinutes] = useState(
    defaultConfig.intervalMinutes
  );

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: AgendaConfig = JSON.parse(stored);
        setStartHour(parsed.startHour || defaultConfig.startHour);
        setEndHour(parsed.endHour || defaultConfig.endHour);
        setIntervalMinutes(parsed.intervalMinutes || defaultConfig.intervalMinutes);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const config: AgendaConfig = {
      startHour,
      endHour,
      intervalMinutes,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    alert("Configurações da agenda salvas com sucesso.");
  }

  function handleReset() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
    setStartHour(defaultConfig.startHour);
    setEndHour(defaultConfig.endHour);
    setIntervalMinutes(defaultConfig.intervalMinutes);
    alert("Configurações restauradas.");
  }

  if (!ready) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <>
      <AppHeader />

      <main className="container">
        <h1 className="page-title">Configurações da Agenda</h1>
        <p className="page-subtitle">
          Ajuste os horários exibidos no calendário semanal.
        </p>

        <form onSubmit={handleSave} className="form-card">
          <div className="field">
            <label className="label">Hora inicial</label>
            <input
              type="time"
              className="input"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="label">Hora final</label>
            <input
              type="time"
              className="input"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="label">Intervalo (minutos)</label>
            <select
              className="select"
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(Number(e.target.value))}
            >
              <option value={15}>15 minutos</option>
              <option value={20}>20 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={60}>60 minutos</option>
            </select>
          </div>

          <div className="actions" style={{ marginTop: 16 }}>
            <button type="submit" className="button button-primary">
              Salvar configurações
            </button>

            <button
              type="button"
              className="button button-secondary"
              onClick={handleReset}
            >
              Restaurar padrão
            </button>
          </div>
        </form>
      </main>
    </>
  );
}