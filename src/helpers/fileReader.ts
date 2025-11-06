
// Let TypeScript know about the global variables from the CDN scripts
declare var mammoth: any;
declare var pdfjsLib: any;

export const extractTextFromFile = async (file: File): Promise<string> => {
    const fileType = file.type;
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return extractTextFromDocx(file);
    } else if (fileType === 'application/pdf') {
        return extractTextFromPdf(file);
    } else {
        throw new Error('Unsupported file type. Please upload a .docx or .pdf file.');
    }
};

const extractTextFromDocx = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            if (event.target?.result) {
                try {
                    const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
                    resolve(result.value);
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(new Error("Failed to read file"));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};

const extractTextFromPdf = async (file: File): Promise<string> => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = async (event) => {
            if (event.target?.result) {
                try {
                    const pdf = await pdfjsLib.getDocument({ data: event.target.result as ArrayBuffer }).promise;
                    let textContent = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const text = await page.getTextContent();
                        textContent += text.items.map((s: any) => s.str).join(' ');
                    }
                    resolve(textContent);
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(new Error("Failed to read file"));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};
