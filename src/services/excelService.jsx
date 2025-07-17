// Define the base URL for the API.
const API_BASE_URL = 'http://localhost:5000';

/**
 * Handles the import of an Excel file by sending it to the server for processing.
 * This function uses callbacks for success and error handling.
 *
 * @param {File} file - The Excel file to be uploaded.
 * @param {function(any): void} onSuccess - Callback function to execute on successful upload and processing.
 * @param {function(string): void} onError - Callback function to execute if an error occurs.
 */
export const handleExcelImport = async (file, onSuccess, onError) => {
    // Check if a file was provided. If not, call the onError callback and return.
    if (!file) {
        if (onError) {
            onError('No file selected');
        }
        return;
    }

    try {
        // Create a FormData object to prepare the file for sending as a multipart/form-data request.
        const formData = new FormData();
        // Append the Excel file to the FormData object under the name 'excel'.
        formData.append('excel', file);

        // Send the file to the server for processing using the fetch API.
        const response = await fetch(`${API_BASE_URL}/excel/upload`, {
            method: 'POST', // Use the POST method for file uploads.
            body: formData, // Set the FormData object as the request body.
        });

        // Check if the HTTP response was successful (status code 2xx).
        if (!response.ok) {
            // If the response was not OK, parse the error data from the response.
            const errorData = await response.json();
            // Throw a new error with a message from the server or a default message.
            throw new Error(errorData.message || 'Failed to upload and process Excel file');
        }

        // Parse the successful response data as JSON.
        const data = await response.json();

        // If an onSuccess callback is provided, call it with the relevant user data.
        // It attempts to extract data from different possible keys in the response.
        if (onSuccess) {
            onSuccess(data.userData || data.users || data.data || data);
        }
    } catch (error) {
        // Catch any errors that occur during the fetch operation or response processing.
        console.error('Excel import error:', error); // Log the error to the console.
        // If an onError callback is provided, call it with the error message.
        if (onError) {
            onError(error.message || 'שגיאה בייבוא הקובץ. ודא שהפורמט תקין.'); // Provide a default Hebrew error message.
        }
    }
};

/**
 * An alternative function to upload an Excel file, returning a Promise.
 * This function is designed for easier integration with async/await patterns.
 *
 * @param {File} file - The Excel file to be uploaded.
 * @returns {Promise<any>} A Promise that resolves with the processed data from the server.
 * @throws {Error} Throws an error if no file is selected or if the upload/processing fails.
 */
export const uploadExcelFile = async (file) => {
    // Check if a file was provided. If not, throw an error.
    if (!file) {
        throw new Error('No file selected');
    }

    // Create a FormData object to send the file.
    const formData = new FormData();
    formData.append('excel', file); // Append the Excel file.

    // Send the file to the server.
    const response = await fetch(`${API_BASE_URL}/excel/upload`, {
        method: 'POST',
        body: formData,
    });

    // Check if the HTTP response was successful.
    if (!response.ok) {
        // If not OK, parse the error data and throw an error.
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload and process Excel file');
    }

    // Parse the successful response data and return the relevant user data.
    return data.userData || data.users || data.data || data;
};
