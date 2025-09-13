import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import flag from "../../../assets/flag.png";
import { Link } from "react-router-dom";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "Isabela",
    email: "Isabela@gmail.com",
    phone: "1234567890",
  });

  const [profileImage, setProfileImage] = useState(
    "https://images.app.goo.gl/mrJyRYZVPjsik1j19"
  );

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = () => {
    // Handle save logic here
    console.log("Saving changes:", formData);
    alert("Changes saved successfully!");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className=" font-sans ">
      {/* Main Content Area */}
      <div className=" px-4 py-8 mt-16">
        {/* Profile Card and Information Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <div className="relative ">
              <Avatar className="h-40 w-40 ">
                <AvatarImage
                  src={profileImage || "/placeholder.svg"}
                  alt="Profile"
                />
                <AvatarFallback>IS</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <label htmlFor="profile-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-white" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <p className="text-lg font-medium text-gray-800">Profile</p>
            <p className="text-gray-600">Admin</p>
          </div>

          {/* Information Fields */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-3">
            <div>
              <Label
                htmlFor="name"
                className="text-gray-700 font-medium text-base mb-2 block"
              >
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-white border border-gray-300 text-gray-800 py-2 px-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#017783] focus:border-transparent"
                placeholder="Enter your name"
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
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-white border border-gray-300 text-gray-800 py-2 px-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#017783] focus:border-transparent"
                placeholder="Enter your email"
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
                <div className="flex items-center border border-gray-300 bg-white rounded-md px-3 py-2 text-gray-800">
                  <img src={flag} alt="Bangladesh" className="h-4 w-6 mr-2" />
                  <span>+1242</span>
                </div>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  type="tel"
                  className="bg-white border border-gray-300 text-gray-800 py-2 px-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#017783] focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Additional Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <div>
                <Link to={"/dashboard/admin-account"}>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
              <Button
                onClick={handleSaveChanges}
                className="flex-1 bg-gradient-to-b from-[#10200B] to-[#2f4b26] text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
