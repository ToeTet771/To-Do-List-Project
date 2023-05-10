
function getDate () {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
    
      const todayDate = new Date().toLocaleDateString("en-US", options);
      return todayDate;
    }

module.exports = getDate;        //!exporting the result of function and get back by calling require('./file')