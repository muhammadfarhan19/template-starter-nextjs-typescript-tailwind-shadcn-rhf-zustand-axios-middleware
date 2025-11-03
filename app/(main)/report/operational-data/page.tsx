import MainContainer from "@/components/layouts/MainContainer";

export default function Page() {
  return (
    <MainContainer>
      {/* header */}
      <div className="col-span-12 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Laporan Harian Operasional</h1>
          <p className="text-sm">
            Monitoring dan pelaporan operasional harian kendaraan fleet
          </p>
        </div>
      </div>
    </MainContainer>
  );
}
