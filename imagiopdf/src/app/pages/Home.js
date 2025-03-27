"use client";
import { useState } from "react";


import { Converter } from "./Converter";

export default function ImageQueueToPDF() {
  
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const imageArry =Array.from(e.target.files);
    setImages(imageArry);
  
  }

  

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-700 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Image Queue to PDF Converter</h1>

      <div className="flex flex-col items-center justify-center">
        <label className="text-lg font-bold mb-2 to-black">Select Images</label>

      <input type="file" accept="image/*" multiple onChange={handleImageChange} className="mb-4 p-2 border rounded" />
        
        <div className="flex flex-wrap">
          {images.length > 0 && Array.from(images).map((image, index) => (
            <img key={index} src={URL.createObjectURL(image)} alt={`Image ${index}`} className="m-2 w-[100px] border rounded" />
          ))}
        </div>
      </div>

      

      <button onClick={()=>Converter(images)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Convert to PDF
      </button>
    </div>
  );
}
