import { useState } from "react"
import { supabase } from "../supabaseClient"

export default function ApplyProposal({ jobId, userId }) {

  const [coverLetter, setCoverLetter] = useState("")
  const [bid, setBid] = useState("")

  async function submitProposal() {

    const { error } = await supabase
      .from("proposals")
      .insert([
        {
          job_id: jobId,
          freelancer_id: userId,
          cover_letter: coverLetter,
          bid_amount: bid
        }
      ])

    if (error) {
      alert(error.message)
    } else {
      alert("Proposal submitted!")
    }
  }

  return (
    <div className="proposal-box">

      <textarea
        placeholder="Write your proposal..."
        onChange={(e)=>setCoverLetter(e.target.value)}
      />

      <input
        type="number"
        placeholder="Your bid amount"
        onChange={(e)=>setBid(e.target.value)}
      />

      <button onClick={submitProposal}>
        Submit Proposal
      </button>

    </div>
  )
}
