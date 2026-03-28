import { useEffect, useState } from "react"
import { detectUserCountry } from "../utils/location"

export default function SmartPayment() {

  const [country, setCountry] = useState(null)

  useEffect(() => {
    async function checkLocation(){
      const c = await detectUserCountry()
      setCountry(c)
    }

    checkLocation()
  }, [])

  if(!country) return <p>Detecting location...</p>

  if(country === "ET"){
    return (
      <div>
        <h3>Pay with Chapa</h3>
        <button>Pay with Telebirr / Local Bank</button>
      </div>
    )
  }

  return (
    <div>
      <h3>Pay with PayPal</h3>
      <button>Pay with PayPal</button>
    </div>
  )

}
