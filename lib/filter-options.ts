import { PresenceStatus } from "@/types/presence.type";
import { RegistrationStatus } from "@/types/student.type";

export const PRESENCE_OPTIONS = {
  key: "presence-type",
  label: "Status",
  options: [
    "Hadir",
    "Terlambat",
    "Sakit",
    "Izin",
    "Alpa",
  ] satisfies PresenceStatus[],
};

export const REGISTRATION_STATUS_OPTIONS = {
  key: "status",
  label: "Status",
  options: [
    "PENDING",
    "APPROVED",
    "REJECTED",
    "CANCELLED",
  ] satisfies RegistrationStatus[],
};
