const express = require("express");
const router = express.Router();
const Job = require("../Model/jobSchema");
const authMiddleware = require("../middleware/Auth");
const dotenv = require("dotenv");
dotenv.config();


// here we have done pagination and searching: and filtering: revise this once:
router.get("/", async (req, res) => {
  const {limit, offset, salary, name} = req.query;
  const jobs = await Job.find({companyName: {$regex: name, $options:"i"}, salary}).skip(offset).limit(limit);
  res.status(200).json(jobs);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const job = await Job.find(id);

  if (!job) {
    return res.status(404).json({ message: "Job Not Found" });
  }

  res.status(200).json(job);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  const userId = req.user.id;

  if (!job) {
    return res.status(404).json({ message: "Job Not Found: " });
  }

  if (userId !== job.user.toString()) {
    return res
      .status(404)
      .json({ message: "You are not authorised to delete this data:" });
  }

  await job.deleteOne({ _id: id });
  res.status(200).json({ message: "Job Deleted" });
});

router.post("/", authMiddleware, async (req, res) => {
  const { companyName, jobPosition, salary, jobType } = req.body;

  if (!companyName || !jobPosition || !salary || !jobType) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = req.user;
    const job = await Job.create({
      companyName,
      jobPosition,
      salary,
      jobType,
      user: user.id,
    });
    res.status(200).json(job);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in Creating Job" });
  }
});

router.put("/:id", authMiddleware, async (req, res)=>{
  const { id } = req.params;
  const job = Job.findById(id);
  const { companyName, jobPosition, salary, jobType } = req.body;

  if(!job){
    return res.status(500).json({message: "Job Not Ofund" })
  }

  if (req.user.id !== job.user.toString()) {
    return res
      .status(404)
      .json({ message: "You are not authorised to Update this Job:" });
  }

  try{
   await job.findByIdAndUpdate(id, {
      companyName, jobPosition, salary, jobType
    })
    res.status(200).json({message: "Job Updated"});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message: "Error in Updating Job:"});
  }
})

module.exports = router;
