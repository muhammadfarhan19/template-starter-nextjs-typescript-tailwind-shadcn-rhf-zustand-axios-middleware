import MainContainer from "@/components/layouts/MainContainer";

export default function DashboardPage() {
  return (
    <MainContainer>
      {/* header */}
      <div className="col-span-12 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Dashboard KRP</h1>
          <p className="text-sm">
            Real-time overview of your fleet operations and performance metrics
          </p>
        </div>
        {/* <div className="flex items-center gap-x-2.5">
          <Button variant={"default"}>
            <Upload /> Import Data
          </Button>
          <Button variant={"secondary"}>
            <Download /> Export Data
          </Button>
          <Button variant={"foreground"}>
            <Plus />
            Tambah Kendaraan
          </Button>
        </div> */}
      </div>
    </MainContainer>
  );
}
