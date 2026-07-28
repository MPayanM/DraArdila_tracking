"use client";

import { useEffect, useState } from "react";
import { PatientIdentify } from "@/components/patient/patient-identify";
import { PatientTracker } from "@/components/patient/patient-tracker";
import {
  getCurrentPatientId,
  getOrCreatePatient,
  getPatient,
  setCurrentPatientId,
  type Patient,
} from "@/lib/local-store";

export default function Home() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = getCurrentPatientId();
    if (id) {
      const existing = getPatient(id);
      if (existing) setPatient(existing);
    }
    setReady(true);
  }, []);

  function handleIdentify(name: string) {
    const p = getOrCreatePatient(name);
    setCurrentPatientId(p.id);
    setPatient(p);
  }

  function handleSwitchPatient() {
    setCurrentPatientId(null);
    setPatient(null);
  }

  if (!ready) {
    return <div className="flex flex-1" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {patient ? (
        <PatientTracker patient={patient} onSwitchPatient={handleSwitchPatient} />
      ) : (
        <PatientIdentify onIdentify={handleIdentify} />
      )}
    </div>
  );
}
