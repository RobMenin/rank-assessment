import React, { useState } from "react";
import { Button } from "react-bootstrap";

interface CountryManagerProps {
  countries: string[];
  bannedCountries: string[];
  updateBannedCountries: (newBannedCountries: string[]) => void;
}

const CountryManager: React.FC<CountryManagerProps> = ({
  countries,
  bannedCountries,
  updateBannedCountries,
}) => {
  const [selectedCountryToAdd, setSelectedCountryToAdd] = useState<string>("");

  const handleAddCountry = () => {
    if (selectedCountryToAdd) {
      if (bannedCountries.includes(selectedCountryToAdd)) {
        window.alert("This country is already banned.");
      } else {
        const updatedBannedCountries = [
          ...bannedCountries,
          selectedCountryToAdd,
        ];
        updateBannedCountries(updatedBannedCountries);
        sessionStorage.setItem(
          "bannedCountries",
          JSON.stringify(updatedBannedCountries)
        );

        setSelectedCountryToAdd("");
      }
    }
  };

  const handleRemoveCountry = (countryToRemove: string) => {
    const updatedBannedCountries = bannedCountries.filter(
      (country) => country !== countryToRemove
    );
    updateBannedCountries(updatedBannedCountries);
    sessionStorage.setItem(
      "bannedCountries",
      JSON.stringify(updatedBannedCountries)
    );
  };

  return (
    <div>
      <select
        className="card-input__input -select"
        value={selectedCountryToAdd}
        onChange={(e) => setSelectedCountryToAdd(e.target.value)}
      >
        <option value="" disabled>
          Select a country to add
        </option>
        {countries.map((country, index) => (
          <option key={index} value={country}>
            {country}
          </option>
        ))}
      </select>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          className="custom-margin-left"
          variant="primary"
          size="sm"
          onClick={handleAddCountry}
        >
          Add new country
        </Button>
      </div>
      <div>
        {bannedCountries.map((country, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>{country}</span>
            <Button
              className="custom-margin-left"
              variant="primary"
              size="sm"
              onClick={() => handleRemoveCountry(country)}
            >
              Remove country
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryManager;
