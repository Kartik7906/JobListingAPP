const express = require("express");
const router = express.Router();
const Job = require("../Model/jobSchema");
const authMiddleware = require("../middleware/Auth");
const dotenv = require("dotenv");
dotenv.config();

// Pagination, searching, and filtering:
router.get("/", async (req, res) => {
  
  const { limit, offset, salary, name } = req.query;
  const query = {};
  
  if (salary) {
    query.salary = { $gte: salary, $lte: salary };
  }
  if (name) {
    query.companyName = { $regex: name, $options: "i" };
  }
  
  try {
    const jobs = await Job.find(query).skip(Number(offset) || 0).limit(Number(limit) || 10);
    const count = await Job.countDocuments(query)
    res.status(200).json({jobs, count});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving jobs" });
  }
});

// Get Job by ID:
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const job = await Job.findById(id); // Correct method
    if (!job) {
      return res.status(404).json({ message: "Job Not Found" });
    }
    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving job" });
  }
});

// Delete Job:
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const job = await Job.findById(id); // Correct method
    if (!job) {
      return res.status(404).json({ message: "Job Not Found" });
    }

    if (userId !== job.user.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne(); // Use deleteOne directly
    res.status(200).json({ message: "Job Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting job" });
  }
});

// Create Job:
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
    res.status(201).json(job); // Use status 201 for creation
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating job" });
  }
});

// Update Job:
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { companyName, jobPosition, salary, jobType } = req.body;

  try {
    const job = await Job.findById(id); // Correct method
    if (!job) {
      return res.status(404).json({ message: "Job Not Found" });
    }

    if (req.user.id !== job.user.toString()) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    await Job.findByIdAndUpdate(id, {
      companyName,
      jobPosition,
      salary,
      jobType,
    }, { new: true });

    res.status(200).json({ message: "Job Updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating job" });
  }
});

module.exports = router;
