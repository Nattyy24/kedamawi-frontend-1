export default function JobCard({ job, onView }) {
  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer" onClick={() => onView(job)}>
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-sm text-gray-600">Budget: {job.currency} {job.amount}</p>
      <p className="text-sm text-gray-500">Status: {job.status}</p>
    </div>
  );
}
