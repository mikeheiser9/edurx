import Image from "next/image";
import Logo from "@/assets/icons/edurxLogo.svg";
import Link from "next/link";

export default () => {
  return (
    <header className="flex fixed w-full bg-[#000] p-2">
      <h1 className="text-white text-2xl font-bold">
        <Link href="/">
          <Image className="h-16 w-16" src={Logo} alt="logo" />
        </Link>
      </h1>
    </header>
  );
};
