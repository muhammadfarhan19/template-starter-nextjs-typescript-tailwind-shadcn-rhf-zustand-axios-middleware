"use client";

import MainContainer from "@/components/layouts/MainContainer";
import { useSearchParams } from "next/navigation";
import StudentForm from "./_components/StudentForm";

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // untuk mode edit

  return (
    <MainContainer>
      {/* Header */}
      <div className="col-span-12 flex items-center justify-between">
        <h1 className="font-semibold text-2xl">Pendaftaran Santri</h1>
      </div>

      <StudentForm />
    </MainContainer>
  );
}
