"use client";

import { useEffect, useState } from "react";

import AppHeader from "../../components/AppHeader";
import AppointmentModal from "../../components/AppointmentModal";

/* ✅ NOVO MODAL PREMIUM */
import MedicalEvolutionModal from "../../components/MedicalEvolutionModal";

import { useRequireAuth } from "../../lib/auth";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("medflow_token")
      : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const statusColor: any = {
  SCHEDULED: "#3b82f6",
  CONFIRMED: "#22c55e",
  CANCELED: "#ef4444",
  COMPLETED: "#8b5cf6",
};

export default function AgendaPage() {
  const { ready } = useRequireAuth();

  const [events, setEvents] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState("");

  /* ✅ PACIENTE DO PRONTUÁRIO */
  const [selectedPatient, setSelectedPatient] =
    useState<any>(null);

  async function loadAll() {
    try {
      const [apptRes, pRes, dRes] =
        await Promise.all([
          fetch(`${API_URL}/appointments`, {
            headers: getAuthHeaders(),
          }),

          fetch(`${API_URL}/patients`, {
            headers: getAuthHeaders(),
          }),

          fetch(`${API_URL}/users/medicos`, {
            headers: getAuthHeaders(),
          }),
        ]);

      const appts = await apptRes.json();

      const filtered = selectedDoctor
        ? appts.filter(
            (a: any) =>
              a.professionalId === selectedDoctor
          )
        : appts;

      setAppointments(filtered);

      setEvents(
        filtered.map((a: any) => ({
          id: a.id,

          title: a.patient.fullName,

          start: a.date,

          end: new Date(
            new Date(a.date).getTime() +
              30 * 60000
          ),

          backgroundColor:
            statusColor[a.status],

          borderColor:
            statusColor[a.status],

          extendedProps: {
            patient: a.patient,
            appointment: a,
          },
        }))
      );

      setPatients(await pRes.json());

      setDoctors(await dRes.json());
    } catch (error) {
      console.error(error);

      alert("Erro ao carregar agenda");
    }
  }

  useEffect(() => {
    if (ready) {
      loadAll();
    }
  }, [ready, selectedDoctor]);

  function handleSelect(info: any) {
    setSelectedDate(info.startStr);

    setModalOpen(true);
  }

  async function handleCreate({
    patientId,
    doctorId,
  }: any) {
    try {
      const res = await fetch(
        `${API_URL}/appointments`,
        {
          method: "POST",

          headers: getAuthHeaders(),

          body: JSON.stringify({
  patientId,
  professionalId: doctorId,
  date: selectedDate,
  status: "SCHEDULED",
  appointmentType: "PARTICULAR",
}),