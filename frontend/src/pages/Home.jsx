import React, { useCallback, useEffect, useRef, useState } from "react";
import { getjob, deleteJob } from "../services";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Creating 2 states one for limit and one for offset values:
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  // These 2 states are used for URL query:
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");

  // initalising debounce timerref:
  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Single fetchJobs function that you can call both on load and after deleting a job
  // modifing fetchjobs function:
  const fetchJobs = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setLoading(true);
      const res = await getjob({
        limit,
        offset: offset * limit,
        name: search || "",
        signal,
      });
      if (res.status === 200) {
        const data = await res.json();
        setJobs(data.jobs);
        setCount(data.count);
      } else {
        console.error("Error fetching jobs:", res.statusText);
      }
    } catch (error) {
      console.error("Error during job fetch:", error.message);
    } finally {
      setLoading(false);
    }
  }, [limit,offset,search]);

  // now write the debounced fetch job function here:
  const debouncedFetchJobs = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    // setting up a new timer:
    debounceTimerRef.current = setTimeout(() => {
      fetchJobs();
    }, 2000);
  }, [fetchJobs]);

  // Fetch jobs when the component loads or search/limit/offset changes
  useEffect(() => {
    debouncedFetchJobs();
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [limit, offset, search, debouncedFetchJobs]);

  const handleDeletejob = async (id) => {
    try {
      const res = await deleteJob(id);
      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        alert("Job deleted successfully");
        fetchJobs(); // Re-fetch jobs after successful deletion
      } else if (res.status === 401) {
        alert("You are not authorized to delete this job.");
      } else {
        console.error(res);
        alert("An error occurred.");
      }
    } catch (error) {
      console.error("Error during job deletion:", error.message);
      alert("An error occurred while deleting the job.");
    }
  };

  return (
    <div>
      <h1>This is Home:</h1>
      <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search"
          />
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <div>
            {jobs.map((job) => (
              <div key={job._id}>
                <h2>{job.companyName}</h2>
                <p>{job.jobPosition}</p>
                <button onClick={() => navigate(`/editjob/${job._id}`)}>
                  Edit
                </button>
                <button onClick={() => handleDeletejob(job._id)}>Delete</button>
              </div>
            ))}
          </div>

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
          </select>

          <button disabled={offset === 0} onClick={() => setOffset(offset - 1)}>
            Prev
          </button>
          <button
            disabled={(offset + 1) * limit >= count}
            onClick={() => setOffset(offset + 1)}
          >
            Next
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
