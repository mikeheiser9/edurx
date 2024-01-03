import { LeftPanel } from "@/app/forum/components/leftPanel";
import { LeftPanelWrapper } from "./leftPanelWrapper";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { HubLeftPenal } from "@/app/hub/components/leftPanel";
import Image from "next/image";
import EduLogo from "../assets/imgs/eduRx-logo-2.png";
import eduRxLogo from "../assets/icons/eduRx-black.svg";
import { useState } from "react";
const HeaderNav = dynamic(() => import("./headerNav"), { ssr: false });

const leftPanelComponents = {
  forum: LeftPanel,
  hub: HubLeftPenal,
  resources:HubLeftPenal,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const [isSidebarOpen,setIsSidebarOpen] = useState(false)

  const getLeftPanel = () => {
    const Comp =
      leftPanelComponents[
        pathName?.replace("/", "") as keyof typeof leftPanelComponents
      ];
    return <Comp setIsSidebarOpen={setIsSidebarOpen} />;
  };

  return (
    <div className="flex flex-col w-full">
    <div className="logo-top md:p-4 md:pb-0 h-[91px] md:block hidden">
      <div className="logo-desktop block ipad-under:hidden pl-7">
        <span className="inline-block w-10">
          <Image src={EduLogo} alt="Edu Logo" width={300} />
        </span>
      </div>
      <div className="line w-full border-[3px] border-b-0 border-eduLightBlue h-[13px] mt-2.5 rounded-[6px_6px_0px_0px]" ></div>
    </div>
    <div className="flex md:p-4 md:px-5 w-full h-screen overflow-hidden md:max-h-[calc(100dvh_-_91px)]">
      <LeftPanelWrapper isSidebarOpen={isSidebarOpen}>{getLeftPanel()}</LeftPanelWrapper>
      <div className="flex-1 flex overflow-hidden flex-col gap-2">
        <HeaderNav setIsSidebarOpen={setIsSidebarOpen}/>
        {/* Nested inner routes */}
        <div className="w-full md:p-4 ipad-under:px-4 ipad-under:pb-[90px] flex flex-col h-full overflow-hidden">{children}</div>
      </div>
    </div>
    </div>
  );
}
