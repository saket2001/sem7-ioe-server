const axios = require("axios");
const dbOperations = require("./db");
// 1. Every 5-10 sec i check for motion
// 2. If motion then send notification to user
// 3. If user says yes to feed (check on app) then feed.
require("dotenv").config();
const { utils } = require("./utiles");

const routes = {
  checkServer: async (req, res) => {
    try {
      const response = await axios.get(`http://${process.env.NODEMCU_PORT}`);
      res.status(200).json({ isError: false, message: response.data });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ isError: true, message: "Error connecting to servers" });
    }
  },
  ownerSignIn: async (req, res) => {
    try {
      const owner = req.body;
      // checking for empty inputs
      for (key in owner) {
        if (owner[key].length === 0)
          return res
            .status(200)
            .json({ isError: true, message: `${key} field cannot be empty` });
      }

      const message = await dbOperations.ownerSignIn(owner);

      if (message.message === "success")
        return res.status(200).json({
          isError: false,
          message: "Owner signed in successfully",
          data: message.data,
        });
      else return res.status(200).json({ isError: true, message });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ isError: true, message: "Error connecting to servers" });
    }
  },
  createOwner: async (req, res) => {
    try {
      const owner = req.body;
      // console.log(owner);
      // checking for empty inputs
      for (key in owner) {
        if (owner[key].length === 0)
          return res
            .status(200)
            .json({ isError: true, data: `${key} field cannot be empty` });
      }

      const message = await dbOperations.createOwner(owner);
      if (message === "success")
        return res
          .status(200)
          .json({ isError: false, message: "Owner created successfully." });
      else return res.status(200).json({ isError: true, message });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ isError: true, message: "Error connecting to servers" });
    }
  },
  deleteOwner: async (req, res) => {
    try {
      const { owner_id } = req.params;
      // checking for empty inputs
      for (key in data) {
        if (owner[key].length === 0)
          return res
            .status(200)
            .json({ isError: true, data: `${key} field cannot be empty` });
      }
      const response = dbOperations.deleteOwner(owner_id);
      if (response === "success") {
        return res
          .status(200)
          .json({ isError: false, message: "Owner deleted successfully." });
      } else return res.status(200).json({ isError: true, message });
    } catch {
      console.log(err);
    }
  },
  getDistance: async (req, res) => {
    const response = await axios.get("http://192.168.36.253/get-distance");

    if (!response) return res.status(500).json({ isError: true });

    res.status(200).json({ isError: false, data: response.data });
  },
  feedPet: async (req, res) => {
    try {
      // send data to db
      const record = req.body;

      // checking for empty inputs
      for (key in record) {
        if (record[key].length === 0)
          return res
            .status(200)
            .json({ isError: true, data: `${key} field cannot be empty` });
      }

      const message = await dbOperations.storeFoodRecord(record);

      if (message === "success") {
        await axios.get(`http://${process.env.NODEMCU_PORT}/feed-pet`);
        return res
          .status(200)
          .json({ isError: false, message: "Pet fed properly" });
      } else return res.status(200).json({ isError: true, message });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ isError: true, message: "Error connecting to servers" });
    }
  },
  checkForMotion: async (req, res) => {
    try {
      let response = await axios.get(
        `http://${process.env.NODEMCU_PORT}/get-motion`
      );

      // send notification to user
      res.status(200).json({ isError: false, data: response.data });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ isError: true, message: "Error connecting to servers" });
    }
  },
  getDetailsById: async (req, res) => {
    try {
      const { owner_id } = req.params;
      const message = await dbOperations.getDetailsById(owner_id);
      if (message)
        return res.status(200).json({ isError: false, data: message });
      else return res.status(200).json({ isError: true, message });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ isError: true, message: "Error connecting to servers" });
    }
  },
  getFeedingDetailsById: async (req, res) => {
    try {
      const { owner_id } = req.params;
      const message = await dbOperations.getFeedingDetailsById(owner_id);
      if (message)
        return res.status(200).json({ isError: false, data: message });
      else return res.status(200).json({ isError: true, message });
    } catch (err) {
      console.log(err);
    }
  },
  getFeedingDetailsByDate: async (req, res) => {
    try {
      const { owner_id, date } = req.params;
      console.log(owner_id, date);
      const response = await dbOperations.getFeedingDetailsByDate(
        owner_id,
        date
      );
      if (response)
        return res.status(200).json({ isError: false, data: response });
      else return res.status(200).json({ isError: true, response });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ isError: true, message: "Error connecting to servers" });
    }
  },
  getTodaysFeedingDetailsById: async (req, res) => {
    try {
      const { owner_id } = req.params;
      const response = await dbOperations.getFeedingDetailsById(owner_id);
      if (response) {
        const todaysDate = new Date().toDateString();

        const todaysData = response.filter(
          (d) => new Date(d.dateTime).toDateString() === todaysDate
        );

        return res.status(200).json({ isError: false, data: todaysData });
      } else return res.status(200).json({ isError: true, response });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ isError: true, message: "Error connecting to servers" });
    }
  },
  manageAutoFeed: async (req, res) => {
    try {
      // checking for empty inputs
      for (key in req.body) {
        if (req.body[key].length === 0)
          return res
            .status(200)
            .json({ isError: true, data: `${key} field cannot be empty` });
      }
      const response = await dbOperations.storeAutoFeedRecord(req.body);
      if (response) {
        return res.status(200).json({ isError: false, data: response });
      } else return res.status(200).json({ isError: true, data: response });
    } catch (err) {
      console.log(err);
    }
  },
  getAutoFeedRecord: async (req, res) => {
    try {
      const { owner_id } = req.params;
      const response = await dbOperations.getAutoFeedRecord(owner_id);
      if (response) {
        return res.status(200).json({ isError: false, data: response });
      } else return res.status(200).json({ isError: true, data: response });
    } catch (err) {
      console.log(err);
    }
  },
  dataAnalysis: async (req, res) => {
    try {
      let dataAnalysis = {
        todaysTotal: 0,
        weeksTotal: 0,
        monthsTotal: 0,
        noOfTimesFedToday: 0,
      };
      temp = [];
      let count = 0;
      const { owner_id, date } = req.params;
      const response = await dbOperations.getDataForAnalysis(owner_id, date);
      if (response) {
        // todays total consumption
        response.forEach((d) => {
          if (d.date === date) count = +count + parseInt(d.amountGiven);
          dataAnalysis["todaysTotal"] = count;
        });
        count = 0;

        // this week's total consumption
        const queryWeek = utils.calWeekNumber(date);
        response.forEach((d) => {
          if (utils.calWeekNumber(d.date) === queryWeek)
            count = +count + parseInt(d.amountGiven);
          dataAnalysis["weeksTotal"] = count;
        });
        count = 0;

        // no of times owner fed the pet
        response.forEach((d) => {
          if (d.date === date && d.type_of_action === "Fed by owner") {
            count++;
          }
          dataAnalysis["noOfTimesFedToday"] = count;
        });
        count = 0;

        // this month's total consumption
        const queryMonth = new Date(date).getMonth();
        response.forEach((d) => {
          if (new Date(d.date).getMonth() === queryMonth)
            count = +count + parseInt(d.amountGiven);
          dataAnalysis["monthsTotal"] = count;
        });
        count = 0;

        return res.status(200).json({ isError: false, data: dataAnalysis });
      } else return res.status(200).json({ isError: true, response });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ isError: true, message: "Error connecting to servers" });
    }
  },
  getWeeklyRecord: async (req, res) => {
    try {
      // owner id
      const { owner_id } = req.params;

      // get data
      const data = await dbOperations.getDataForAnalysis(owner_id);

      // calculate week days data to send
      const currMonth = new Date().getMonth();
      const currWeek = utils.calWeekNumber(new Date());

      let weekData = {
        '0':0,  // sun
        '1':0,  // mon
        '2':0,
        '3':0,
        '4':0,
        '5':0,
        '6':0,
      };
      // getting this month's data
      const monthsData = data?.map((d) => {
        if (new Date(d?.date).getMonth() === currMonth) return d;
      });

      // getting current week's data
      monthsData?.forEach((d) => {
        if (utils.calWeekNumber(d?.date) === 4) {
          const prevAmt = weekData[new Date(d?.date).getDay().toString()];
          weekData[new Date(d?.date).getDay().toString()] =
            prevAmt + +d?.amountGiven.slice(0,3);
        }
      });

      //
      return res.status(200).json({ isError: false, data: weekData });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ isError: true, message: "Error connecting to servers" });
    }
  },
};

module.exports = routes;
