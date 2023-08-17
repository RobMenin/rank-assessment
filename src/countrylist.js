import axios from "axios";

export async function fetchCountries() {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    const countryNames = response.data.map((country) => country.name.common);
    return countryNames;
  } catch (error) {
    console.error("Error fetching country data:", error);
    return [];
  }
}
