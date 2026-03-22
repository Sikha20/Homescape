"use client";
import { updateProperty } from '@/actions/updateProperty';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react'
import toast from 'react-hot-toast';

function Form({ id }: { id: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        const loadingToast = toast.loading('Updating property...');

        try {
            // Validate image size before submission
            const images = formData.getAll('images') as File[];
            const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes

            for (const image of images) {
                if (image.size > MAX_SIZE) {
                    toast.dismiss(loadingToast);
                    toast.error('Image size must be less than 5MB');
                    setIsLoading(false);
                    return;
                }
            }

            const response = await updateProperty(formData, id);

            toast.dismiss(loadingToast);
            if (response.success) {
                toast.success(response.message);
                router.push("/manage-listings");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("An error occurred while updating the property");
            console.error("Property update error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-semibold mb-6 text-center">Edit Property</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Location</label>
                <select
                    name="location"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={isLoading}
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

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Price (per month)</label>
                <input
                    type="number"
                    name="price"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Property Type</label>
                <select
                    name="category"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={isLoading}
                >
                    <option value="">Select property type</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="HOUSE">House</option>
                    <option value="VILLA">Villa</option>
                    <option value="COMMERCIAL_SPACE">Commercial Space</option>
                    <option value="ROOM">Room</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Rooms</label>
                    <input
                        type="number"
                        name="noOfRooms"
                        required
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        min="1"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Bathrooms</label>
                    <input
                        type="number"
                        name="noOfBathrooms"
                        required
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        min="1"
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    name="description"
                    rows={4}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    minLength={10}
                    maxLength={1000}
                    disabled={isLoading}
                ></textarea>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Property Images (Max 5MB per image)
                </label>
                <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Each image must be less than 5MB</p>
            </div>
            <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                {isLoading ? 'Updating...' : 'Update Property'}
            </button>
        </form>
    )
}

export default Form