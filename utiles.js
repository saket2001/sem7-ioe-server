exports.utils = {
    checkFields: (data) => {
      // checking for empty inputs
      for (key in data) {
        if (owner[key].length === 0)
          return res
            .status(200)
            .json({ isError: true, data: `${key} field cannot be empty` });
      }
  },
  calWeekNumber: (date) => {
    const currDate = new Date(date);
    const startDate = new Date(currDate.getFullYear(), currDate.getMonth(), 1);
    let days = Math.floor((currDate - startDate) / (24 * 60 * 60 * 1000));
    let weekNumber = Math.ceil(days / 7);
    return weekNumber;
  }
}