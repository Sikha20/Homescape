"use client"
import { createProperty } from "@/actions/createProperty"
import { toast } from 'react-hot-toast';
import Button from "./_components/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const PropertyForm = () => {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      // Validate image size before submission
      const images = formData.getAll('images') as File[];
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes

      for (const image of images) {
        if (image.size > MAX_SIZE) {
          toast.error(`Image ${image.name} exceeds 5MB limit`);
          return;
        }
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
            <label className="block text-sm font-semibold mb-2 text-gray-700">Location</label>
            <select
              name="location"
              className="w-full p-3 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white/50 backdrop-blur-sm transition-all duration-200"
              required
            >
              <option value="">Select a location</option>
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
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Property Images (Max 5MB per image)
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              className="w-full p-3 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white/50 backdrop-blur-sm transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              required
            />
            <p className="text-xs text-gray-500 mt-2">Each image must be less than 5MB</p>
          </div>
          <Button />
        </form>
      </div>
      <div className="w-full md:w-1/2 order-1 md:order-2">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-primary/20">
          <Image
            width={330}
            height={330}
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            alt="Beautiful house"
            className="w-full h-56 object-cover"
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
