export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

export interface PdfTextResult {
    text: string;
    pageCount: number;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        // Set the worker source to use local file with proper Vite asset handling
        lib.GlobalWorkerOptions.workerSrc = new URL("/pdf.worker.min.mjs", window.location.origin).href;
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        // Validate file type
        if (!file.type.includes("pdf")) {
            return {
                imageUrl: "",
                file: null,
                error: "Invalid file type. Only PDF files are supported.",
            };
        }

        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;

        // Check if PDF has pages
        if (pdf.numPages === 0) {
            return {
                imageUrl: "",
                file: null,
                error: "PDF document has no pages.",
            };
        }

        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 2 }); // Reduced scale for better performance
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Failed to get 2D canvas context");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        await page.render({ canvasContext: context, viewport }).promise;

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        // Create a File from the blob with the same name as the pdf
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png"
            ); // PNG format doesn't use quality parameter
        });
    } catch (err) {
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}

/** Extract selectable text from all PDF pages for real resume analysis. */
export async function extractTextFromPdf(file: File): Promise<PdfTextResult> {
    if (!file.type.includes("pdf")) throw new Error("Only PDF files can be analyzed.");

    const lib = await loadPdfJs();
    const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: { str?: string }) => item.str || "").join(" ").replace(/\s+/g, " ").trim();
        if (pageText) pages.push(pageText);
    }
    const text = pages.join("\n\n").trim();
    if (!text) throw new Error("No selectable text was found. Upload a text-based PDF or add OCR support.");
    return { text, pageCount: pdf.numPages };
}
