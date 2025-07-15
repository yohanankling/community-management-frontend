import * as XLSX from 'xlsx';

export const handleExcelImport = (file, onSuccess, onError) => {
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                if (onSuccess) {
                    onSuccess(sheet);
                }
            } catch (error) {
                console.error('Import error:', error);
                if (onError) {
                    onError('שגיאה בייבוא הקובץ. ודא שהפורמט תקין.');
                }
            }
        };
        reader.readAsArrayBuffer(file);
    }
};
