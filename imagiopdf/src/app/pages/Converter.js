import { PDFDocument } from "pdf-lib";

// Convert Images to PDF
export async function Converter(Images) {
    if (Images.length === 0) {
        alert("Please select at least one image!");
        return;
    }

    const pdfDoc = await PDFDocument.create();

    for (const image of Images) {
        const arrayBuffer = await readFileAsArrayBuffer(image);
        let embeddedImage, scaleFactor;

        if (image.type === "image/png") {
            embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else if (image.type === "image/jpeg" || image.type === "image/jpg") {
            embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        } else {
            alert(`Unsupported file type: ${image.type}. Only PNG and JPG are allowed.`);
            throw new Error(`Unsupported file type: ${image.type}`);
        }

        // Scale image to fit the page
        const page = pdfDoc.addPage(); // Create a new page for each image
        const { width, height } = page.getSize();

        // Scale the image to fit within the page
        scaleFactor = Math.min(width / embeddedImage.width, height / embeddedImage.height);
        const imgWidth = embeddedImage.width * scaleFactor * 0.9; // 90% of page width
        const imgHeight = embeddedImage.height * scaleFactor * 0.9; // 90% of page height

        // Center the image on the page
        page.drawImage(embeddedImage, {
            x: (width - imgWidth) / 2,
            y: (height - imgHeight) / 2,
            width: imgWidth,
            height: imgHeight,
        });
    }

    // Save PDF
    const pdfBytes = await pdfDoc.save();

    // Trigger a download in the browser
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "images.pdf";
    link.click();
}

// Helper function to convert image to ArrayBuffer
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}
