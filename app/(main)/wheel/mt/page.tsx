import MainContainer from "@/components/layouts/MainContainer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Page() {
  return (
    <MainContainer>
      {/* header */}
      <div className="col-span-12 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">
            Jadwal Pemasangan Ban - Mobil Tanki
          </h1>
          <p className="text-sm">
            Kelola jadwal pemasangan dan penggantian ban Mobil Tanki
          </p>
        </div>
        <div className="flex items-center gap-x-2.5">
          <Button variant={"default"}>
            <Plus /> Buat Jadwal Baru
          </Button>
        </div>
      </div>
    </MainContainer>
  );
}
