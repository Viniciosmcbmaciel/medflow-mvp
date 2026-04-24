"use client";

import { Suspense } from "react";
import ResetPasswordContent from "./reset-content";

export default function Page() {
  return (
    <Suspense fallback={<div className="container">Carregando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}