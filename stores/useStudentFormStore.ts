import { StudentFormValues } from "@/app/(main)/students/formulir/_components/StudentForm";
import { create } from "zustand";

interface StudentFormStore {
  selectedStudent: StudentFormValues | null;
  fetchStudentById: (id: string) => void;
  resetStudent: () => void;
}

export const useStudentFormStore = create<StudentFormStore>((set) => ({
  selectedStudent: null,

  fetchStudentById: (id) => {
    // nanti diganti panggilan API nyata
    const dummy = {
      name: "Ahmad",
      phone: "08123456789",
      class: "B",
      gender: "MALE" as const,
      status: "PENDING" as const,
    };
    set({ selectedStudent: dummy });
  },

  resetStudent: () => set({ selectedStudent: null }),
}));
