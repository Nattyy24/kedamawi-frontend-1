import { supabase } from "../supabaseClient";

export default function ClientJobs({ user }) {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    const { data } = await supabase.from("jobs").select("*").eq("client_id", user.id);
    setJobs(data);
  };

  useEffect(() => { fetchJobs(); }, []);

  const completeJob = async (job) => {
    const res = await fetch("/api/completeJob", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_id: job.id, client_id: user.id }),
    });
    const data = await res.json();
    if (data.success) alert(`Job completed! ${data.paid} added to freelancer wallet`);
    fetchJobs();
  };

  return (
    <div>
      <h2>Your Jobs</h2>
      <ul>
        {jobs.map(j => (
          <li key={j.id}>
            {j.title} - {j.status} 
            {j.status !== "completed" && <button onClick={() => completeJob(j)}>Mark Completed</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
