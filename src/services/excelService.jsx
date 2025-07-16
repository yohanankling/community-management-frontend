const API_BASE_URL = 'http://localhost:5000';

export const handleExcelImport = async (file, onSuccess, onError) => {
    if (!file) {
        if (onError) {
            onError('No file selected');
        }
        return;
    }

    try {
        // Create FormData to send file to server
        const formData = new FormData();
        formData.append('excel', file);

        // Send file to server for processing
        const response = await fetch(`${API_BASE_URL}/excel/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload and process Excel file');
        }

        const data = await response.json();
        
        if (onSuccess) {
            onSuccess(data.userData || data.users || data.data || data);
        }
    } catch (error) {
        console.error('Excel import error:', error);
        if (onError) {
            onError(error.message || 'שגיאה בייבוא הקובץ. ודא שהפורמט תקין.');
        }
    }
};

// Alternative function that returns a Promise for easier async/await usage
export const uploadExcelFile = async (file) => {
    if (!file) {
        throw new Error('No file selected');
    }

    const formData = new FormData();
    formData.append('excel', file);

    const response = await fetch(`${API_BASE_URL}/excel/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload and process Excel file');
    }

    const data = await response.json();
    return data.userData || data.users || data.data || data;
};
