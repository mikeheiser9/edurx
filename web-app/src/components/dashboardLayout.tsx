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
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <div className="w-full p-4 px-8">
        <Image width={40} height={40} src={eduRxLogo} alt="eduRx-Logo" />
      </div>
      <span className="border-2 border-b-0 h-6 -mb-7 rounded-lg rounded-b-none border-eduLightBlue w-[99%] self-center" />
      <div className="flex p-5 w-full h-screen overflow-hidden">
        <LeftPanelWrapper>{getLeftPanel()}</LeftPanelWrapper>
        <div className="flex-1 flex overflow-hidden flex-col gap-2">
          <HeaderNav />
          {/* Nested inner routes */}
          <div className="w-full p-4 flex flex-col h-full overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
