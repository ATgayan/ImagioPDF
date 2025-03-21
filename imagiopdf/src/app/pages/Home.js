"use client";
import { useState } from "react";
import { jsPDF } from "jspdf";

export default function ImageQueueToPDF() {
  const [images, setImages] = useState([]);

  // Handle Image Upload and Add to Queue
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages).then((imageData) => {
      setImages((prevImages) => [...prevImages, ...imageData]);
    });
  };

  // Generate PDF with All Images from Queue
  const generatePDF = () => {
    if (images.length === 0) {
      alert("Please upload at least one image!");
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    images.forEach((img, index) => {
      if (index > 0) pdf.addPage();
      pdf.addImage(img, "JPEG", 10, 10, 190, 0);
    });

    pdf.save("images.pdf");
  };

  // Remove Image from Queue
  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Image Queue to PDF Converter</h1>

      <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="mb-4 p-2 border rounded" />

      <div className="grid grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div key={index} className="relative">
            <img src={img} alt={`Preview ${index}`} className="w-32 h-auto border rounded shadow-md" />
            <button
              className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-full"
              onClick={() => removeImage(index)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <button onClick={generatePDF} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Convert to PDF
      </button>
    </div>
  );
}
