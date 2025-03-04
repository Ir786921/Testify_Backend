const {BaseUser} = require("../models/User.models")
const getOrganisationDashboard = async (req, res) => {
    const { userId } = req.params;
     console.log(userId);
     // Extract userId from the request parameters
  
    try {
      const user = await BaseUser.findById(userId).populate("testsCreated");
      console.log(user);
       // Fetch user and populate tests
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (!user.isOrganisation) {
        return res.status(403).json({ message: "Access restricted to organizations only" });
      }
  
      res.status(200).json({
        message: "Organization dashboard fetched successfully",
        testsCreated: user.testsCreated,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  module.exports = {
    getOrganisationDashboard
  }