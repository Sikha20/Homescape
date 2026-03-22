import { notFound } from "next/navigation";
import Image from "next/image";
import Form from "../_components/Form";

interface Props {
    params: Promise<{
        id: string;
    }>
}

export default async function EditPropertyPage({ params }: Props) {
    const { id } = await params;

    if (!id) notFound();

    return (
        <div className="flex flex-col md:flex-row max-w-4xl mx-auto gap-8 items-start">
            <div className="w-full md:w-1/2 order-2 md:order-1">
                <Form id={id} />
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mb-8 md:mb-0">
                    <Image width={100} height={100}
                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                        alt="Beautiful house"
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Tips for Property Images</h3>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>You can add multiple images to showcase your property from different angles.</li>
                            <li>Provide clear photos of all bedrooms, bathrooms, and key areas (kitchen, living room, etc.).</li>
                            <li>Make sure your images are well-lit and high quality for better visibility.</li>
                            <li>Properties without enough evidence/photos may not be accepted for listing.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
