"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PatientIdentify } from "@/components/patient/patient-identify";
import { PatientTracker } from "@/components/patient/patient-tracker";
import {
  getCurrentPatientId,
  getOrCreatePatient,
  getPatient,
  setCurrentPatientId,
  type Patient,
} from "@/lib/data";

export default function PacientePage() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = getCurrentPatientId();
    if (!id) {
      setReady(true);
      return;
    }
    getPatient(id).then((existing) => {
      if (existing) setPatient(existing);
      else setCurrentPatientId(null);
      setReady(true);
    });
  }, []);

  async function handleIdentify(name: string) {
    const p = await getOrCreatePatient(name);
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
      <AnimatePresence mode="wait" initial={false}>
        {patient ? (
          <motion.div
            key="tracker"
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-1 flex-col"
          >
            <PatientTracker patient={patient} onSwitchPatient={handleSwitchPatient} />
          </motion.div>
        ) : (
          <motion.div
            key="identify"
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-1 flex-col"
          >
            <PatientIdentify onIdentify={handleIdentify} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
