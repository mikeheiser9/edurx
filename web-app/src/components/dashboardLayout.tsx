import { LeftPanel } from "@/app/forum/components/leftPanel";
import { LeftPanelWrapper } from "./leftPanelWrapper";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { HubLeftPenal } from "@/app/hub/components/leftPanel";
import Image from "next/image";
import eduRxLogo from "../assets/icons/eduRx-black.svg";
const HeaderNav = dynamic(() => import("./headerNav"), { ssr: false });

const leftPanelComponents = {
  forum: LeftPanel,
  hub: HubLeftPenal,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();

  const getLeftPanel = () => {
    const Comp =
      leftPanelComponents[
        pathName?.replace("/", "") as keyof typeof leftPanelComponents
      ];
    return <Comp />;
  };

  return (
    <div className="flex flex-col w-full">
    <div className="md:p-4 md:pb-0 h-[76px] md:block hidden">
     <div className="logo-desktop block ipad-under:hidden pl-7"><a className="inline-block" href="#"><img src="https://i.ibb.co/gwRZ6gm/edu-Rx-blue-1.png" alt="edu-Rx-blue-1"/></a></div>
      <div className="line w-full border-[2px] border-b-0 border-eduLightBlue h-[13px] mt-2.5 rounded-[6px_6px_0px_0px]" ></div>
    </div>
    <div className="flex md:p-4 md:px-5 w-full h-screen overflow-hidden md:max-h-[calc(100dvh_-_76px)]">
      <LeftPanelWrapper>{getLeftPanel()}</LeftPanelWrapper>
      <div className="flex-1 flex overflow-hidden flex-col gap-2">
        <HeaderNav />
        {/* Nested inner routes */}
        <div className="w-full md:p-4 ipad-under:px-4 ipad-under:pb-[90px] flex flex-col h-full overflow-hidden">{children}</div>
      </div>
    </div>
    </div>
  );
}
