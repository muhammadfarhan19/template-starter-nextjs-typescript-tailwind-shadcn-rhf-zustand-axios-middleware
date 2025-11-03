import MainContainer from "@/components/layouts/MainContainer";

export default function Page() {
  return (
    <MainContainer>
      {/* header */}
      <div className="col-span-12 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Master Data AMT</h1>
          <p className="text-sm">Master Data AMT</p>
        </div>
      </div>
    </MainContainer>
  );
}
