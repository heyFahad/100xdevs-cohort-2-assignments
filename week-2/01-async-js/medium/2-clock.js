/**
 * A utility function to pad an extra 0 to the start of time parameter
 * @param {number} str Time parameter to pad
 * @returns {string} The input number, padded with an extra 0 if needed
 */
function pad(str) {
    return str.toString().padStart(2, '0');
}

setInterval(() => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const timeString24H = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    const timeString12H = `${pad(hours > 12 ? hours - 12 : hours)}:${pad(minutes)}:${pad(seconds)} ${hours < 12 ? 'AM' : 'PM'}`;

    console.clear();
    console.log(timeString24H);
    console.log(timeString12H);
}, 1000);
