const Owner = require("./model/owner");
const EatingRecords = require("./model/eating-record");
const AutoFeedDetails = require("./model/AutoFeedDetails");
const bcrypt = require("bcrypt");

///////////////////////////////////////
const dbOperations = {
  createOwner: async (owner) => {
    try {
      const doesOwnerExists = await Owner.find({ email: owner.email });
      // redirect if owner with email already exists
      if (doesOwnerExists && doesOwnerExists.length !== 0)
        return "Owner already exists with this email!";
      else {
        const newOwner = new Owner({
          ...owner,
          password: await bcrypt.hash(owner.password, 10),
        });
        newOwner.save();
        return "success";
      }
    } catch (err) {
      return err;
    }
  },
  ownerSignIn: async (owner) => {
    try {
      // check email
      let ownerData;
      const ownerInfo = await Owner.find(
        { email: owner.email },
        { password: 1, _id: 1 }
      );

      if (!ownerInfo || ownerInfo.length === 0)
        return "Owner doesn't exists with this email!";

      // check password
      const isValidPass = await bcrypt.compare(
        owner.password.toString(),
        ownerInfo[0].password.toString()
      );

      // get autoFeedData of owner
      const autoFeedData = await AutoFeedDetails.find({
        owner_id: ownerInfo[0]._id,
      });
      
      // if no auto feeding data is found
      if (autoFeedData.length<=0 || autoFeedData === []) {
        ownerData = {
          owner_id: ownerInfo[0]._id,
        };
      } else {
        ownerData = autoFeedData[0];
      }
      
      if (isValidPass) {
        return {
          message: "success",
          data: ownerData,
        };
      }
      return "Owner password is wrong! Please try again with correct password";
    } catch (err) {
      return err;
    }
  },
  deleteOwner: async (owner_id) => {
    try {
      const doesOwnerExists = await Owner.findById(owner_id);
      // redirect if owner with email already exists
      if (doesOwnerExists && doesOwnerExists.length !== 0)
        return "Owner doesn't exists with this Id!";
      else {
        await Owner.findByIdAndDelete(owner_id);
        return "success";
      }
    } catch (err) {
      return err;
    }
  },
  storeFoodRecord: async (record) => {
    try {
      console.log(record)
      record.owner_id ? record.owner_id : '63484ddedff7651386a1b146';
      const doesOwnerExists = Owner.findById(record.owner_id);
      if (!doesOwnerExists) return "Owner doesn't exists with this ID";

      // checking for multiple entries of same time
      const storedFeedData = await EatingRecords.find({
        owner_id: record.owner_id,
        time: record.time,
        date: record.date,
      });

      if (storedFeedData.length > 0)
        return "Already feed entry present for given time. Can't feed the pet at same time!";
      else {
        const newRecord = new EatingRecords(record);
        newRecord.save();
        return "success";
      }
    } catch (err) {
      return "Pet wasn't fed properly something went wrong!";
    }
  },
  getDetailsById: async (id) => {
    try {
      const details = await Owner.findById(id);
      if (!details) return "Details not found for given owner ID";
      return details;
    } catch (err) {
      return new Error(err);
    }
  },
  getFeedingDetailsById: async (id, paramDate = new Date()) => {
    try {
      const details = await EatingRecords.find({ owner_id: id });
      // const sortedDetails = details.map((d) =>
      //   new Date(d.dateTime) === paramDate
      // );
      // if (!details) return "Details not found for given owner ID";
      return details;
    } catch (err) {
      return new Error(err);
    }
  },
  getTodaysFeedingDetailsById: async (id) => {
    try {
      const details = await EatingRecords.find({
        owner_id: id,
        dateTime: new Date(),
      });
      if (!details) return "Details not found for given owner ID";
      return details;
    } catch (err) {
      return new Error(err);
    }
  },
  getFeedingDetailsByDate: async (id, date) => {
    try {
      let temp = [];
      let details = await EatingRecords.find({
        owner_id: id,
      });
      // filtering by date
      details?.forEach((d) => {
        if (new Date(d.date).toDateString() === new Date(date).toDateString())
          temp.push(d);
      });
      // console.log(temp);

      if (!temp) return "Details not found for given owner ID";
      return temp;
    } catch (err) {
      return new Error(err);
    }
  },
  storeAutoFeedRecord: async (record) => {
    try {
      return await AutoFeedDetails.findOneAndUpdate(
        {
          owner_id: record.owner_id,
        },
        {
          ...record,
        }
      )
        .then(() => "Successfully saved the automatic feeding record")
        .catch(() => "Failed to save/update the automatic feeding record!");
    } catch (err) {
      console.log(err);
      return "Failed to save/update the automatic feeding record!";
    }
  },
  getAutoFeedRecord: async (id) => {
    try {
      const ownerData = AutoFeedDetails.find({
        owner_id: id,
      });
      if (!ownerData) return "Details for this owner doesn't exists!";

      return ownerData;
    } catch (err) {
      return "Failed to get the automatic feeding record!";
    }
  },
  getDataForAnalysis: async (id, date) => {
    try {
      const data = await EatingRecords.find({ owner_id: id });
      if (!data) return "error";
      // console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = dbOperations;
