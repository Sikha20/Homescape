"use client"
import { useState, useRef } from "react";
import { createProperty } from "@/actions/createProperty"
import { toast } from 'react-hot-toast';
import Button from "./_components/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, UploadCloud } from "lucide-react";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("./_components/MapPicker"), { ssr: false });

const PropertyForm = () => {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
      const validFiles = filesArray.filter(file => {
        if (file.size > MAX_SIZE) {
          toast.error(`Image ${file.name} exceeds 5MB limit`);
          return false;
        }
        return true;
      });
      setSelectedImages((prev) => [...prev, ...validFiles]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (selectedImages.length === 0) {
        toast.error("Please select at least one property image.");
        return;
      }

      // Append state images directly to formData instead of relying on input
      formData.delete("images"); // Remove any native empty selections
      selectedImages.forEach((img) => formData.append("images", img));

      if (coordinates) {
        formData.append("latitude", coordinates.lat.toString());
        formData.append("longitude", coordinates.lng.toString());
      }

      const response = await createProperty(formData);

      if (response.success) {
        toast.success(response.message);
        router.push("/dashboard");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred while creating the property");
      console.error("Property creation error:", error);
    }
  }

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-8 items-start p-6">
      <div className="w-full md:w-1/2 order-2 md:order-1">
        <form action={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 w-full border border-primary/20">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">List Your Property</h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">City / District</label>
            <select
              name="location"
              className="w-full p-3 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white/50 backdrop-blur-sm transition-all duration-200"
              required
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Select a city</option>
              <option value="Kathmandu">Kathmandu</option>
              <option value="Pokhara">Pokhara</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Bhaktapur">Bhaktapur</option>
              <option value="Biratnagar">Biratnagar</option>
              <option value="Birgunj">Birgunj</option>
              <option value="Dharan">Dharan</option>
              <option value="Nepalgunj">Nepalgunj</option>
              <option value="Butwal">Butwal</option>
              <option value="Dhangadhi">Dhangadhi</option>
              <option value="Itahari">Itahari</option>
              <option value="Hetauda">Hetauda</option>
              <option value="Janakpur">Janakpur</option>
              <option value="Bharatpur">Bharatpur</option>
              <option value="Chitwan">Chitwan</option>
              <option value="Lumbini">Lumbini</option>
              <option value="Gorkha">Gorkha</option>
              <option value="Ilam">Ilam</option>
              <option value="Tansen">Tansen</option>
              <option value="Dhulikhel">Dhulikhel</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Exact Property Location</label>
            <MapPicker
              city={selectedCity}
              onLocationChange={(lat, lng) => setCoordinates({ lat, lng })}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Price (per month)</label>
            <input
              type="number"
              name="price"
              className="w-full p-3 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white/50 backdrop-blur-sm transition-all duration-200"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Property Type</label>
            <select
              name="category"
              className="w-full p-3 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white/50 backdrop-blur-sm transition-all duration-200"
              required
            >
              <option value="">Select property type</option>
              <option value="APARTMENT">Apartment</option>
              <option value="HOUSE">House</option>
              <option value="VILLA">Villa</option>
              <option value="COMMERCIAL_SPACE">Commercial Space</option>
              <option value="ROOM">Room</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Rooms</label>
              <input
                type="number"
                name="noOfRooms"
                required
                className="w-full p-3 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white/50 backdrop-blur-sm transition-all duration-200"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Bathrooms</label>
              <input
                type="number"
                name="noOfBathrooms"
                required
                className="w-full p-3 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white/50 backdrop-blur-sm transition-all duration-200"
                min="1"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
            <textarea
              name="description"
              rows={4}
              className="w-full p-3 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white/50 backdrop-blur-sm transition-all duration-200"
              required
              minLength={10}
              maxLength={1000}
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Property Images (Max 5MB per image)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/50 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors duration-200"
            >
              <UploadCloud className="w-10 h-10 text-primary mb-2" />
              <p className="text-gray-600 font-medium">Click to browse and choose files</p>
              <p className="text-sm text-gray-400 mt-1">Accepts images up to 5MB</p>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageSelect}
              />
            </div>

            {/* Image Previews */}
            {selectedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-4">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button />
        </form>
      </div>
      <div className="w-full md:w-1/2 order-1 md:order-2">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-primary/20">
          <Image
            width={600}
            height={400}
            src="/aesthetic_3d_house.png"
            alt="Beautiful house"
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Tips for Property Images</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span className="text-gray-600">You can add multiple images to showcase your property from different angles.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span className="text-gray-600">Provide clear photos of all bedrooms, bathrooms, and key areas (kitchen, living room, etc.).</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span className="text-gray-600">Make sure your images are well-lit and high quality for better visibility.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span className="text-gray-600">Properties without enough evidence/photos may not be accepted for listing.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
