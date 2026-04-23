"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppHeader from "../../../components/AppHeader";
import { useRequireAuth } from "../../../lib/auth";

type MedicalRecord = {
  id: string;
  patientId: string;
  chiefComplaint: string;
  historyPresentIllness?: string | null;
  medications?: string | null;
  physicalExam?: string | null;
  conduct?: string | null;
  notes?: string | null;
  createdAt: string;
};

type PrescriptionItem = {
  id: string;
  medication: string;
  dosage: string;
  instructions: string;
  duration?: string | null;
};

type Prescription = {
  id: string;
  notes?: string | null;
  signed: boolean;
  signedAt?: string | null;
  createdAt: string;
  items: PrescriptionItem[];
};

type ExamItem = {
  id: string;
  examName: string;
  justification?: string | null;
};

type ExamOrder = {
  id: string;
  notes?: string | null;
  createdAt: string;
  items: ExamItem[];
};

type TabType =
  | "anamnese"
  | "evolucao"
  | "prescricao"
  | "exames"
  | "historico";

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

function openPdf(url: string) {
  const token = localStorage.getItem("medflow_token");

  fetch(url, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error("Erro ao gerar PDF");
      }

      const blob = await res.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
    })
    .catch((error) => {
      console.error(error);
      alert("Erro ao gerar PDF");
    });
}

function ProntuarioContent() {
  const { ready } = useRequireAuth();
  const params = useParams();
  const patientId = params?.id as string;

  const [activeTab, setActiveTab] = useState<TabType>("anamnese");

  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [examOrders, setExamOrders] = useState<ExamOrder[]>([]);

  const [chiefComplaint, setChiefComplaint] = useState("");
  const [historyPresentIllness, setHistoryPresentIllness] = useState("");
  const [medications, setMedications] = useState("");
  const [physicalExam, setPhysicalExam] = useState("");
  const [conduct, setConduct] = useState("");
  const [notes, setNotes] = useState("");

  const [prescriptionNotes, setPrescriptionNotes] = useState("");
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [duration, setDuration] = useState("");

  const [examNotes, setExamNotes] = useState("");
  const [examName, setExamName] = useState("");
  const [examJustification, setExamJustification] = useState("");

  const [loadingRecords, setLoadingRecords] = useState(false);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const [loadingExams, setLoadingExams] = useState(false);

  async function loadRecords() {
    try {
      setLoadingRecords(true);

      const res = await fetch(`${API_URL}/medical-records/${patientId}`, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao carregar prontuários");
      }

      setRecords(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar prontuários");
    } finally {
      setLoadingRecords(false);
    }
  }

  async function loadPrescriptions() {
    try {
      setLoadingPrescriptions(true);

      const res = await fetch(`${API_URL}/prescriptions/patient/${patientId}`, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao carregar prescrições");
      }

      setPrescriptions(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar prescrições");
    } finally {
      setLoadingPrescriptions(false);
    }
  }

  async function loadExams() {
    try {
      setLoadingExams(true);

      const res = await fetch(`${API_URL}/exams/patient/${patientId}`, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao carregar exames");
      }

      setExamOrders(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar exames");
    } finally {
      setLoadingExams(false);
    }
  }

  async function handleSaveRecord(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/medical-records`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          patientId,
          chiefComplaint,
          historyPresentIllness,
          medications,
          physicalExam,
          conduct,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Erro ao salvar prontuário");
      }

      setChiefComplaint("");
      setHistoryPresentIllness("");
      setMedications("");
      setPhysicalExam("");
      setConduct("");
      setNotes("");

      await loadRecords();
      setActiveTab("historico");
      alert("Prontuário salvo com sucesso");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao salvar prontuário");
    }
  }

  async function handleSavePrescription(e: React.FormEvent) {
    e.preventDefault();

    try {
      const createRecordRes = await fetch(`${API_URL}/medical-records`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          patientId,
          chiefComplaint: "Prescrição médica",
          historyPresentIllness: null,
          medications: null,
          physicalExam: null,
          conduct: null,
          notes: prescriptionNotes || null,
        }),
      });

      const medicalRecord = await createRecordRes.json();

      if (!createRecordRes.ok) {
        throw new Error(
          medicalRecord.message || medicalRecord.error || "Erro ao criar registro"
        );
      }

      const prescriptionRes = await fetch(`${API_URL}/prescriptions`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          medicalRecordId: medicalRecord.id,
          notes: prescriptionNotes || undefined,
          items: [
            {
              medication,
              dosage,
              instructions,
              duration: duration || undefined,
            },
          ],
        }),
      });

      const prescriptionData = await prescriptionRes.json();

      if (!prescriptionRes.ok) {
        throw new Error(
          prescriptionData.message || "Erro ao salvar prescrição"
        );
      }

      setPrescriptionNotes("");
      setMedication("");
      setDosage("");
      setInstructions("");
      setDuration("");

      await loadPrescriptions();
      await loadRecords();

      alert("Prescrição salva com sucesso");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao salvar prescrição");
    }
  }

  async function handleSaveExam(e: React.FormEvent) {
    e.preventDefault();

    try {
      const createRecordRes = await fetch(`${API_URL}/medical-records`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          patientId,
          chiefComplaint: "Solicitação de exame",
          historyPresentIllness: null,
          medications: null,
          physicalExam: null,
          conduct: null,
          notes: examNotes || null,
        }),
      });

      const medicalRecord = await createRecordRes.json();

      if (!createRecordRes.ok) {
        throw new Error(
          medicalRecord.message || medicalRecord.error || "Erro ao criar registro"
        );
      }

      const examRes = await fetch(`${API_URL}/exams`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          medicalRecordId: medicalRecord.id,
          notes: examNotes || undefined,
          items: [
            {
              examName,
              justification: examJustification || undefined,
            },
          ],
        }),
      });

      const examData = await examRes.json();

      if (!examRes.ok) {
        throw new Error(examData.message || "Erro ao salvar exame");
      }

      setExamNotes("");
      setExamName("");
      setExamJustification("");

      await loadExams();
      await loadRecords();

      alert("Solicitação de exame salva com sucesso");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao salvar exame");
    }
  }

  async function handleSignPrescription(prescriptionId: string) {
    try {
      const res = await fetch(`${API_URL}/prescriptions/${prescriptionId}/sign`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao assinar prescrição");
      }

      await loadPrescriptions();
      alert("Prescrição assinada com sucesso");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao assinar prescrição");
    }
  }

  useEffect(() => {
    if (ready && patientId) {
      loadRecords();
      loadPrescriptions();
      loadExams();
    }
  }, [ready, patientId]);

  if (!ready) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <>
      <AppHeader />

      <main className="container">
        <div
          className="form-card"
          style={{
            marginBottom: 24,
            background:
              "linear-gradient(135deg, rgba(22,163,74,0.07), rgba(37,99,235,0.05))",
          }}
        >
          <h1 className="page-title" style={{ marginBottom: 8 }}>
            Prontuário do Paciente
          </h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            Evolução clínica, prescrições, exames e histórico em uma experiência
            visual mais profissional.
          </p>
        </div>

        <div className="actions" style={{ marginBottom: 20 }}>
          <button
            type="button"
            className={`button ${
              activeTab === "anamnese" ? "button-primary" : "button-secondary"
            }`}
            onClick={() => setActiveTab("anamnese")}
          >
            Anamnese
          </button>

          <button
            type="button"
            className={`button ${
              activeTab === "evolucao" ? "button-primary" : "button-secondary"
            }`}
            onClick={() => setActiveTab("evolucao")}
          >
            Evolução
          </button>

          <button
            type="button"
            className={`button ${
              activeTab === "prescricao" ? "button-primary" : "button-secondary"
            }`}
            onClick={() => setActiveTab("prescricao")}
          >
            Prescrição
          </button>

          <button
            type="button"
            className={`button ${
              activeTab === "exames" ? "button-primary" : "button-secondary"
            }`}
            onClick={() => setActiveTab("exames")}
          >
            Exames
          </button>

          <button
            type="button"
            className={`button ${
              activeTab === "historico" ? "button-primary" : "button-secondary"
            }`}
            onClick={() => setActiveTab("historico")}
          >
            Histórico
          </button>
        </div>

        {(activeTab === "anamnese" || activeTab === "evolucao") && (
          <form onSubmit={handleSaveRecord} className="form-card">
            <h2 className="section-title">
              {activeTab === "anamnese" ? "Anamnese" : "Evolução Clínica"}
            </h2>

            <div className="field">
              <label className="label">Queixa principal</label>
              <input
                className="input"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="label">História da doença atual</label>
              <textarea
                className="textarea"
                value={historyPresentIllness}
                onChange={(e) => setHistoryPresentIllness(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label">Medicamentos em uso</label>
              <textarea
                className="textarea"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label">Exame físico</label>
              <textarea
                className="textarea"
                value={physicalExam}
                onChange={(e) => setPhysicalExam(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label">Conduta</label>
              <textarea
                className="textarea"
                value={conduct}
                onChange={(e) => setConduct(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label">Observações</label>
              <textarea
                className="textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="button button-primary">
              Salvar registro
            </button>
          </form>
        )}

        {activeTab === "prescricao" && (
          <>
            <form onSubmit={handleSavePrescription} className="form-card">
              <h2 className="section-title">Nova Prescrição</h2>

              <div className="field">
                <label className="label">Medicamento</label>
                <input
                  className="input"
                  value={medication}
                  onChange={(e) => setMedication(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label className="label">Dosagem</label>
                <input
                  className="input"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label className="label">Instruções</label>
                <textarea
                  className="textarea"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label className="label">Duração</label>
                <input
                  className="input"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="label">Observações</label>
                <textarea
                  className="textarea"
                  value={prescriptionNotes}
                  onChange={(e) => setPrescriptionNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="button button-primary">
                Salvar prescrição
              </button>
            </form>

            <section className="form-card">
              <h2 className="section-title">Histórico de Prescrições</h2>

              {loadingPrescriptions ? (
                <div className="empty-state">Carregando prescrições...</div>
              ) : prescriptions.length === 0 ? (
                <div className="empty-state">Nenhuma prescrição encontrada.</div>
              ) : (
                <div className="list">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="item-card">
                      <div className="item-title">
                        {new Date(prescription.createdAt).toLocaleString("pt-BR")}
                      </div>

                      {prescription.items.map((item) => (
                        <div key={item.id} style={{ marginBottom: 12 }}>
                          <div className="item-text">
                            <strong>Medicamento:</strong> {item.medication}
                          </div>
                          <div className="item-text">
                            <strong>Dosagem:</strong> {item.dosage}
                          </div>
                          <div className="item-text">
                            <strong>Instruções:</strong> {item.instructions}
                          </div>
                          <div className="item-text">
                            <strong>Duração:</strong> {item.duration || "—"}
                          </div>
                        </div>
                      ))}

                      <div className="item-text">
                        <strong>Observações:</strong> {prescription.notes || "—"}
                      </div>

                      <div className="item-text">
                        <strong>Status:</strong>{" "}
                        {prescription.signed
                          ? "Assinada"
                          : "Pendente de assinatura"}
                      </div>

                      {prescription.signedAt && (
                        <div className="item-text">
                          <strong>Assinada em:</strong>{" "}
                          {new Date(prescription.signedAt).toLocaleString("pt-BR")}
                        </div>
                      )}

                      <div className="actions" style={{ marginTop: 12 }}>
                        <button
                          type="button"
                          className="button button-blue"
                          onClick={() =>
                            openPdf(`${API_URL}/prescriptions/${prescription.id}/pdf`)
                          }
                        >
                          Gerar PDF
                        </button>

                        {!prescription.signed && (
                          <button
                            type="button"
                            className="button button-green"
                            onClick={() => handleSignPrescription(prescription.id)}
                          >
                            Assinar prescrição
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === "exames" && (
          <>
            <form onSubmit={handleSaveExam} className="form-card">
              <h2 className="section-title">Nova Solicitação de Exame</h2>

              <div className="field">
                <label className="label">Nome do exame</label>
                <input
                  className="input"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label className="label">Justificativa</label>
                <textarea
                  className="textarea"
                  value={examJustification}
                  onChange={(e) => setExamJustification(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="label">Observações</label>
                <textarea
                  className="textarea"
                  value={examNotes}
                  onChange={(e) => setExamNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="button button-primary">
                Salvar solicitação
              </button>
            </form>

            <section className="form-card">
              <h2 className="section-title">Histórico de Exames</h2>

              {loadingExams ? (
                <div className="empty-state">Carregando exames...</div>
              ) : examOrders.length === 0 ? (
                <div className="empty-state">Nenhum exame encontrado.</div>
              ) : (
                <div className="list">
                  {examOrders.map((exam) => (
                    <div key={exam.id} className="item-card">
                      <div className="item-title">
                        {new Date(exam.createdAt).toLocaleString("pt-BR")}
                      </div>

                      {exam.items.map((item) => (
                        <div key={item.id} style={{ marginBottom: 12 }}>
                          <div className="item-text">
                            <strong>Exame:</strong> {item.examName}
                          </div>
                          <div className="item-text">
                            <strong>Justificativa:</strong>{" "}
                            {item.justification || "—"}
                          </div>
                        </div>
                      ))}

                      <div className="item-text">
                        <strong>Observações:</strong> {exam.notes || "—"}
                      </div>

                      <div className="actions" style={{ marginTop: 12 }}>
                        <button
                          type="button"
                          className="button button-blue"
                          onClick={() => openPdf(`${API_URL}/exams/${exam.id}/pdf`)}
                        >
                          Gerar PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === "historico" && (
          <section className="form-card">
            <h2 className="section-title">Histórico Clínico</h2>

            {loadingRecords ? (
              <div className="empty-state">Carregando registros...</div>
            ) : records.length === 0 ? (
              <div className="empty-state">Nenhum registro encontrado.</div>
            ) : (
              <div className="list">
                {records.map((record) => (
                  <div key={record.id} className="item-card">
                    <div className="item-title">
                      {new Date(record.createdAt).toLocaleString("pt-BR")}
                    </div>

                    <div className="item-text">
                      <strong>Queixa principal:</strong> {record.chiefComplaint}
                    </div>

                    <div className="item-text">
                      <strong>HDA:</strong>{" "}
                      {record.historyPresentIllness || "—"}
                    </div>

                    <div className="item-text">
                      <strong>Medicamentos:</strong> {record.medications || "—"}
                    </div>

                    <div className="item-text">
                      <strong>Exame físico:</strong> {record.physicalExam || "—"}
                    </div>

                    <div className="item-text">
                      <strong>Conduta:</strong> {record.conduct || "—"}
                    </div>

                    <div className="item-text">
                      <strong>Observações:</strong> {record.notes || "—"}
                    </div>

                    <div className="actions" style={{ marginTop: 12 }}>
                      <button
                        type="button"
                        className="button button-blue"
                        onClick={() =>
                          openPdf(`${API_URL}/medical-records/${record.id}/pdf`)
                        }
                      >
                        Gerar PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
}

export default function ProntuarioPage() {
  return (
    <Suspense fallback={<div className="container">Carregando...</div>}>
      <ProntuarioContent />
    </Suspense>
  );
}