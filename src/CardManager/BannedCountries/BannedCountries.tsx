import { Fragment, useEffect, useState } from "react";
import CountryManager from "../../components/CountryManager";
import { fetchCountries } from "../../countrylist";

export default function BannedCountries() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const countryNames = await fetchCountries();
      setCountries(countryNames);
    }

    fetchData();
  }, []);
  const storedBannedCountries = sessionStorage.getItem("bannedCountries");
  const initialBannedCountries = storedBannedCountries
    ? JSON.parse(storedBannedCountries)
    : [];

  const [bannedCountries, setBannedCountries] = useState<string[]>(
    initialBannedCountries
  );

  return (
    <Fragment>
      <div className="banned-form">
        <h1 className="home-page-heading">Banned Countries</h1>
        <CountryManager
          countries={countries}
          bannedCountries={bannedCountries}
          updateBannedCountries={(newBannedCountries) => {
            setBannedCountries(newBannedCountries);
            sessionStorage.setItem(
              "userAddedBannedCountries",
              JSON.stringify(newBannedCountries)
            );
          }}
        />
      </div>
    </Fragment>
  );
}
