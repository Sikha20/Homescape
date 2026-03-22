'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface PropertyImageSliderProps {
    images?: string[]
    price?: number
}

const PropertyImageSlider = ({ images = [], price }: PropertyImageSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Auto scroll every 3 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === (images.length - 1) ? 0 : prevIndex + 1
            )
        }, 3000)

        return () => clearInterval(timer)
    }, [images.length])

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === (images.length - 1) ? 0 : prevIndex + 1
        )
    }

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        )
    }

    return (
        <div className="relative h-full min-h-[400px] group">
            {images.length > 0 ? (
                <>
                    <Image
                        src={images[currentIndex]}
                        alt={`Property image ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                    />

                    {/* Price tag */}
                    <div className="absolute top-4 right-4 bg-[#fa3e58] text-white px-4 py-2 rounded-full font-bold">
                        NPR {price?.toLocaleString()}
                    </div>

                    {/* Navigation buttons */}
                    <button
                        onClick={goToPrevious}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <FaChevronLeft size={24} />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <FaChevronRight size={24} />
                    </button>

                    {/* Image indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${currentIndex === index ? 'bg-white w-4' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">No images available</p>
                </div>
            )}
        </div>
    )
}

export default PropertyImageSlider
