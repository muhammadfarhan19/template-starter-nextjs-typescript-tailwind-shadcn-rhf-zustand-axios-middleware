import React from "react";

const MainContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full grid grid-cols-12 border-t p-8 gap-3 md:gap-5 bg-white">
      {children}
    </div>
  );
};

export default MainContainer;
