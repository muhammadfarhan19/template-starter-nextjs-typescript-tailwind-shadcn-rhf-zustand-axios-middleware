import MainContainer from "@/components/layouts/MainContainer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Page() {
  return (
    <MainContainer>
      {/* header */}
      <div className="col-span-12 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Form Unit Ganti Sewa</h1>
          <p className="text-sm">
            Kelola pengajuan pergantian kendaraan operasional
          </p>
        </div>
        <div className="flex items-center gap-x-2.5">
          <Button variant={"default"}>
            <Plus /> Ajukan Pergantian
          </Button>
        </div>
      </div>
    </MainContainer>
  );
}
