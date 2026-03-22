"use client"
import { useState } from 'react'
import Image from 'next/image'

interface PropertyImage {
    image: string;
}

interface PropertyDetails {
    images: PropertyImage[];
    location: string;
}

interface ImageSliderProps {
    propertyDetails: PropertyDetails;
}

function ImageSlider({ propertyDetails }: ImageSliderProps) {
    console.log(propertyDetails)
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!propertyDetails?.images?.length) {
        return null
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === propertyDetails.images.length - 1 ? 0 : prevIndex + 1
        )
    }

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? propertyDetails.images.length - 1 : prevIndex - 1
        )
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    return (
        <div className="relative h-[500px] w-full">
            {propertyDetails.images.map((image, index: number) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <Image
                        src={image.image || "/logo.png"}
                        alt={`Property in ${propertyDetails?.location} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                    />
                </div>
            ))}
            <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-white/75 transition-colors text-white hover:text-black"
                onClick={goToPrevious}
                aria-label="Previous image"
            >
                ←
            </button>
            <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-white/75 transition-colors text-white hover:text-black"
                onClick={goToNext}
                aria-label="Next image"
            >
                →
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {propertyDetails.images.map((_, index: number) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-black hover:bg-white/75'
                            }`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default ImageSlider
