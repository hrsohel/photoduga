import {
  LayoutDashboard,
  Users2,
  Settings,
  UserCog,
  Info,
  FileText,
  ScrollText,
  LogOut,
  ChevronRight,
  ChevronDown,
  Menu,
  Music,
  ShoppingCart,
  TrendingUp,
  Gift,
  Image,
  Calendar,
  Sticker,
  Palette,
  ChartBarStacked,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Sidebar Items
const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: ChartBarStacked,
    children: [
      {
        title: "Photo Album",
        href: "/dashboard/categories/photo-album",
        icon: Image,
      },
      { title: "Gifts", href: "/dashboard/categories/gifts", icon: Gift },
      {
        title: "Photo Prints",
        href: "/dashboard/categories/photo-prints",
        icon: FileText,
      },
      { title: "Canvas", href: "/dashboard/categories/canvas", icon: Palette },
      {
        title: "Calendars",
        href: "/dashboard/categories/calendars",
        icon: Calendar,
      },
      {
        title: "Sticker Album",
        href: "/dashboard/categories/sticker-album",
        icon: Sticker,
      },
    ],
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users2,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Revenue Reports",
    href: "/dashboard/revenue-reports",
    icon: TrendingUp,
  },
  {
    title: "Admin Account",
    href: "/dashboard/admin-account",
    icon: UserCog,
  },
];

function LogoSection({ name = "Photo Album Pro", title = "Admin Panel" }) {
  return (
    <Link to="/dashboard">
      <div className="flex items-center p-4 sm:p-6 flex-col justify-center text-white border-b border-gray-700 hover:text-white">
        <h1 className="text-xl sm:text-2xl font-bold pb-1">{name}</h1>
      </div>
    </Link>
  );
}

function SidebarNav({ onLinkClick, isMobile = false }) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleExpanded = (href) =>
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((i) => i !== href) : [...prev, href]
    );

  const isExpanded = (href) => expandedItems.includes(href);

  return (
    <nav className="flex-1 p-2 sm:p-4 overflow-y-auto flex flex-col">
      <ul className="space-y-1 sm:space-y-2 flex-1">
        {sidebarItems.map((item) => {
          const hasChildren = !!item.children?.length;
          const isChildActive = item.children?.some(
            (child) => location.pathname === child.href
          );
          const isActive = location.pathname === item.href || isChildActive;
          const expanded = isExpanded(item.href);

          return (
            <li key={item.href}>
              {hasChildren ? (
                <>
                  <Button
                    onClick={() => toggleExpanded(item.href)}
                    className={cn(
                      "w-full justify-start gap-2 h-8 sm:h-10 text-sm sm:text-base",
                      isActive
                        ? "bg-white text-green-900"
                        : "text-white bg-transparent hover:bg-transparent hover:text-white"
                    )}
                  >
                    <item.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {expanded ? (
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                  <div
                    className={cn(
                      "transition-all overflow-hidden duration-200 ml-3 sm:ml-4",
                      expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <ul className="space-y-1 mt-1 sm:mt-2">
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.href;
                        return (
                          <li key={child.href}>
                            <Link to={child.href} onClick={onLinkClick}>
                              <Button
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start gap-2 h-7 sm:h-9 text-xs sm:text-sm",
                                  isChildActive
                                    ? "bg-white text-green-900"
                                    : "text-white bg-transparent hover:bg-transparent hover:text-white"
                                )}
                              >
                                <child.icon className="h-3 w-3" />
                                {child.title}
                              </Button>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              ) : (
                <Link to={item.href} onClick={onLinkClick}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 h-8 sm:h-10 text-sm sm:text-base",
                      isActive
                        ? "bg-white text-green-900"
                        : "text-white bg-transparent hover:bg-transparent hover:text-white"
                    )}
                  >
                    <item.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    {item.title}
                  </Button>
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-auto p-2 sm:p-4 border-t border-white/20">
        <Link to="/logout" onClick={onLinkClick}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-8 sm:h-10 text-sm sm:text-base text-white hover:bg-transparent hover:text-white"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            Logout
          </Button>
        </Link>
      </div>
    </nav>
  );
}

function DesktopSidebar() {
  return (
    <div className="hidden lg:flex h-full w-64 flex-col bg-gradient-to-b from-[#10200B] to-[#2f4b26] border-r border-white/20">
      <LogoSection />
      <SidebarNav />
    </div>
  );
}

function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white bg-gradient-to-b from-[#10200B] to-[#2f4b26] h-8 w-8 transition-colors"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 sm:max-w-sm">
        <div className="flex h-full flex-col bg-gradient-to-b from-[#10200B] to-[#2f4b26] text-white">
          <div className="flex items-center p-4 border-b border-white/20">
            <div className="flex items-center gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-semibold">
                  Photo Album Pro
                </h2>
                <p className="text-xs sm:text-sm">Admin Panel</p>
              </div>
            </div>
          </div>
          <SidebarNav onLinkClick={() => setOpen(false)} isMobile={true} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { DesktopSidebar, MobileSidebar };

export default function DashboardSidebar() {
  return <DesktopSidebar />;
}
