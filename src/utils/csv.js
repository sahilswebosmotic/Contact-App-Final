export const REQUIRED_HEADERS = [
    "name",
    "email",
    "phonenumber",
    "profilImage",
    "Contact_id",
];

export const mapRowsToObjects = (rows) => {
    const headers = rows[0];

    return rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index];
        });
        return obj;
    });
};

export const validateCsvHeaders = (headers) => {
    return (
        headers.length === REQUIRED_HEADERS.length &&
        !headers.some((h, i) => h !== REQUIRED_HEADERS[i])
    );
};