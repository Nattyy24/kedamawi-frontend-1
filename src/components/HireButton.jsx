import { supabase } from "../supabaseClient"
import { calculatePayment } from "../utils/payment"
import SmartPayment from "./SmartPayment"

export default function HireButton({ jobId, freelancerId, amount }) {

  async function hireFreelancer() {

    const payment = calculatePayment(amount)

    const { error } = await supabase
      .from("payments")
      .insert([{
        job_id: jobId,
        freelancer_id: freelancerId,
        amount: payment.total,
        platform_fee: payment.platformFee,
        freelancer_amount: payment.freelancerAmount,
        status: "pending"
      }])

    if(error){
      alert(error.message)
    }else{
      alert("Payment created!")
    }

  }

  return (
    <button onClick={hireFreelancer}>
      Hire Freelancer
    </button>
  )
}
