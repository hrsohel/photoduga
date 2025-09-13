import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import flag from "@/assets/flag.png";
import { Link } from "react-router-dom"; // ✅ Correct routing link

const AdminProfile = () => {
  return (
    <div className=" font-sans">
      {/* Main Content Area */}
      <div className=" mx-auto px-4 py-8">
        {/* Edit Profile Button */}
        <div className="flex justify-end mb-8">
          <Link to="/dashboard/admin-account/change-password">
            <Button className="bg-gradient-to-b from-[#10200B] to-[#2f4b26] text-white px-6 py-2 rounded-full flex items-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.586 3.586l-4 4V17h4l4-4-4-4z" />
              </svg>
              <span>Change Password</span>
            </Button>
          </Link>
        </div>

        {/* Profile Card and Information Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1 p-6 flex flex-col items-center bg-white rounded-lg shadow-md">
            <Avatar className="h-40 w-40 mb-4">
              <AvatarImage
                src="https://images.app.goo.gl/mrJyRYZVPjsik1j19"
                alt="Isabela"
              />
              <AvatarFallback>IS</AvatarFallback>
            </Avatar>

            <p className="text-lg font-medium text-gray-800">Profile</p>
            <p className="text-gray-600">Admin</p>

            {/* Edit Profile Button */}
            <Link
              to="/dashboard/admin-account/edit"
              className="mt-6 w-full px-6 py-2 bg-gradient-to-b from-[#10200B] to-[#2f4b26] flex justify-center items-center text-white rounded-full hover:bg-opacity-80 transition duration-200"
            >
              Edit Profile
            </Link>
          </div>

          {/* Information Fields */}
          <div className="md:col-span-2 p-6 bg-white rounded-lg shadow-md space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="text-gray-700 font-medium text-base mb-2 block"
              >
                Name
              </Label>
              <Input
                id="name"
                value="Isabela"
                readOnly
                className="bg-gray-50 border border-gray-200 text-gray-800 py-2 px-3 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <Label
                htmlFor="email"
                className="text-gray-700 font-medium text-base mb-2 block"
              >
                Email
              </Label>
              <Input
                id="email"
                value="Isabela@gmail.com"
                readOnly
                className="bg-gray-50 border border-gray-200 text-gray-800 py-2 px-3 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <Label
                htmlFor="phone"
                className="text-gray-700 font-medium text-base mb-2 block"
              >
                Phone No.
              </Label>
              <div className="flex items-center space-x-2">
                <div className="flex items-center border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-gray-800">
                  <img
                    src={flag}
                    alt="Bangladesh Flag"
                    className="h-4 w-6 mr-2"
                  />
                  <span>+880</span>
                </div>
                <Input
                  id="phone"
                  value="1234567890"
                  readOnly
                  type="tel"
                  className="bg-gray-50 border border-gray-200 text-gray-800 py-2 px-3 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
