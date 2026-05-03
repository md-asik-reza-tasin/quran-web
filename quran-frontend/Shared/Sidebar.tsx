import Link from "next/link";
import Svg from "../Components/Reusable/Svg";
import CustomTooltip from "../Components/Reusable/Tooltip";

export default function Sidebar() {
  const menuItems = [
    { variant: "home", href: "/", label: "Home" },
    { variant: "menu", href: "/menu", label: "Menu" },
    { variant: "aya", href: "/surahs", label: "Surahs" },
    { variant: "bookmark", href: "/bookmarks", label: "Bookmarks" },
    { variant: "settings", href: "/settings", label: "Settings" },
  ];

  return (
    <aside className="grid grid-rows-12 w-[80px] h-screen bg-secondary ">
      {/* 1. Logo Section */}
      <div className="row-span-2 flex items-start justify-center p-3">
        <Svg variant="logo" size={50} />
      </div>

      {/* 2. Navigation Menu */}
      <nav className="flex flex-col gap-10 row-span-8 justify-center items-center">
        {menuItems.map((item) => (
          <CustomTooltip key={item.variant} content={item.label} side="right">
            <Link
              href={item.href}
              className="text-[#8e9aa0] hover:text-primary transition-colors duration-200 flex justify-center group"
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                <Svg variant={item.variant as any} size={28} />
              </div>
            </Link>
          </CustomTooltip>
        ))}
      </nav>

      {/* 3. Bottom Spacer */}
      <div className="row-span-2"></div>
    </aside>
  );
}
