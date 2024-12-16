import React, { useEffect, useState } from "react";
import { createjob, getjobByid, Updatejob } from "../services";
import { useParams } from "react-router-dom";

const Newjob = () => {
  const { id } = useParams();
  const [isedit, setIsedit] = useState(false);
  const [formdata, setFormdata] = useState({
    companyName: "",
    jobPosition: "",
    salary: "",
    jobType: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsedit(true);
    }
  }, [id]);

  useEffect(() => {
    if (isedit && id) {
      const fetchjob = async () => {
        try {
          setLoading(true);
          const res = await getjobByid(id);
          if (res.status === 200) {
            const data = await res.json();
            setFormdata(data);
          } else {
            console.log("Error fetching job:", res);
            alert("Error fetching job data.");
          }
        } catch (error) {
          console.log("Error fetching job data:", error);
          alert("Error occurred while fetching job.");
        } finally {
          setLoading(false);
        }
      };
      fetchjob();
    }
  }, [isedit, id]);

  const handlecreateJob = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = isedit ? await Updatejob(id, formdata) : await createjob(formdata);
      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        setFormdata({
          companyName: "",
          jobPosition: "",
          salary: "",
          jobType: "",
        });
        alert(isedit ? "Job Updated!" : "Job Created!");
      } else if (res.status === 401) {
        alert("Login First");
      } else {
        console.log(res);
        alert("Error occurred");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{isedit ? "Edit Job" : "Create New Job"}</h1>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <form onSubmit={handlecreateJob}>
          <input
            onChange={(e) =>
              setFormdata({ ...formdata, [e.target.name]: e.target.value })
            }
            value={formdata.companyName}
            type="text"
            name="companyName"
            placeholder="Enter Company Name"
          />
          <input
            onChange={(e) =>
              setFormdata({ ...formdata, [e.target.name]: e.target.value })
            }
            value={formdata.jobPosition}
            type="text"
            name="jobPosition"
            placeholder="Enter Job Position"
          />
          <input
            onChange={(e) =>
              setFormdata({ ...formdata, [e.target.name]: e.target.value })
            }
            value={formdata.salary}
            type="text"
            name="salary"
            placeholder="Enter Salary"
          />
          <select
            onChange={(e) =>
              setFormdata({ ...formdata, [e.target.name]: e.target.value })
            }
            value={formdata.jobType}
            name="jobType"
          >
            <option value="">Select Job Type</option>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
          <button type="submit">{isedit ? "Update" : "Create"}</button>
        </form>
      )}
    </div>
  );
};

export default Newjob;
