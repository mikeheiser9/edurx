import { LeftPanel } from "@/app/forum/components/leftPanel";
import { LeftPanelWrapper } from "./leftPanelWrapper";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { HubLeftPenal } from "@/app/hub/components/leftPanel";
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
    <div className="flex p-4 w-full h-screen overflow-hidden">
      <LeftPanelWrapper>{getLeftPanel()}</LeftPanelWrapper>
      <div className="flex-1 flex overflow-hidden flex-col gap-2">
        <HeaderNav />
        {/* Nested inner routes */}
        <div className="w-full p-4 flex flex-col h-full">{children}</div>
      </div>
    </div>
  );
}
