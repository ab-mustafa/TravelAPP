function formatDate(travelDateInput) {

  const date = new Date(travelDateInput);  
  if (isNaN(date.getTime())) {
    return `Invalid date format: ${travelDateInput}`;
  }
  
  date.setUTCHours(0, 0, 0, 0);

  const day = String(date.getUTCDate()).padStart(2, '0'); 
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
  const year = date.getUTCFullYear(); 

  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
}


function capitalizeFirstLetter(str) {
    if (str.length === 0) return str; 
    return str.charAt(0).toUpperCase() + str.slice(1);
  }




export {formatDate, capitalizeFirstLetter}