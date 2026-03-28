export function processPayment(amount) {
  const fee = amount * 0.1;
  const freelancerAmount = amount - fee;

  return {
    fee,
    freelancerAmount
  };
}
