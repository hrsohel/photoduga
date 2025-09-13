import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, LogOut, User, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MobileSidebar } from "./DashboardSidebar";

export default function DashboardHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/signin");
  };

  return (
    <header className="bg-[#FFFFFF] text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Sidebar Trigger */}
          <div className="lg:hidden">
            <MobileSidebar />
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-semibold">
              <span className="hidden sm:inline font-bold text-2xl sm:text-3xl bg-gradient-to-b from-[#10200B] to-[#2f4b26] bg-clip-text text-transparent">
                Welcome to Photo Album Pro!!!
              </span>

              <span className="sm:hidden font-bold text-xl">
                Photo Album Pro
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <Link to={"/dashboard/notifications"}>
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-gradient-to-b from-[#10200B] to-[#2f4b26] rounded-full relative h-8 w-8 sm:h-10 sm:w-10 transition-colors"
            >
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Button>
          </Link>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-white"
              >
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="User"
                  />
                  <AvatarFallback className="bg-black text-white text-xs sm:text-sm font-semibold">
                    DA
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48 sm:w-56"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Dance Admin
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@danceattix.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
