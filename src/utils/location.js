export const detectUserCountry = async () => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return data.country_code; // ET / US
  } catch (err) {
    console.error("Failed to detect location", err);
    return null;
  }
};
