const validateString = (stringToBeChecked) => {
    if (!stringToBeChecked) {
        return false;
    }

    if (typeof (stringToBeChecked) != 'string') {
        return false;
    }

    return (stringToBeChecked.trim() !== '')
};

module.exports = validateString;