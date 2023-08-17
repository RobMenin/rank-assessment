import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { CreditCard } from "../../CardManager/CreditCard";

import { fetchCountries } from "../../countrylist";

const currentYear = new Date().getFullYear();
const monthsArr = Array.from({ length: 12 }, (x, i) => {
  const month = i + 1;
  return month <= 9 ? "0" + month : month;
});
const yearsArr = Array.from({ length: 9 }, (_x, i) => currentYear + i);
interface CardFormProps {
  selectedCreditCard: CreditCard;
  onUpdateState: any;
  setIsCardFlipped: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmitAction: () => void;
  children: any;
}
export default function CardForm(props: CardFormProps) {
  const storedBannedCountries = sessionStorage.getItem("bannedCountries");
  const initialBannedCountries = storedBannedCountries
    ? JSON.parse(storedBannedCountries)
    : [];
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const countryNames = await fetchCountries();
      setCountries(countryNames);
    }

    fetchData();
  }, []);

  const bannedCountries = initialBannedCountries;

  const checkDuplicateCardNumber = (cardNumber: string) => {
    const storedCards = sessionStorage.getItem("cards");
    if (storedCards) {
      const parsedCards = JSON.parse(storedCards) as CreditCard[];
      const duplicateCard = parsedCards.find(
        (card) => card.cardNumber === cardNumber
      );
      return duplicateCard;
    }
    return null;
  };

  const {
    selectedCreditCard,
    onUpdateState,
    setIsCardFlipped,
    handleSubmitAction,
    children,
  } = props;
  const [errors, setErrors] = useState<CreditCard>({
    id: "",
    cardNumber: "",
    cardHolder: "",
    cardMonth: "",
    cardYear: "",
    cardCvv: "",
  });

  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const handleFormChange = (event: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = event.target;

    onUpdateState(name, value);
  };

  const handleFormChangeNumbers = (event: {
    target: { value: string; name: string };
  }) => {
    const { name, value } = event.target;
    if (isNaN(Number(value))) return; //only accept numbers
    onUpdateState(name, value);
  };

  const onCvvFocus = () => {
    setIsCardFlipped(true);
  };

  const onCvvBlur = () => {
    setIsCardFlipped(false);
  };

  const handleConfirmAction = (e: any) => {
    const duplicateCard = checkDuplicateCardNumber(
      selectedCreditCard.cardNumber
    );

    if (bannedCountries.includes(selectedCountry)) {
      alert("Sorry! This country exists in a list of banned countries.");
    } else if (
      duplicateCard &&
      duplicateCard.id !== selectedCreditCard.id // Exclude the currently edited card
    ) {
      alert("A card with the same number already exists.");
    } else if (!isFormHasErrors()) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed

      const selectedYear = parseInt(selectedCreditCard.cardYear, 10);
      const selectedMonth = parseInt(selectedCreditCard.cardMonth, 10);

      if (
        selectedYear < currentYear ||
        (selectedYear === currentYear && selectedMonth < currentMonth)
      ) {
        alert("This card has expired.");
        return;
      }
      handleSubmitAction();
    }
  };

  const handleCountryChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newSelectedCountry = event.target.value;
    setSelectedCountry(newSelectedCountry);
  };
  const isFormHasErrors = () => {
    const newErrors: CreditCard = {
      id: "",
      cardNumber: "",
      cardHolder: "",
      cardMonth: "",
      cardYear: "",
      cardCvv: "",
    };
    // validate blank fields
    let isErrorFlag = false;
    Object.keys(newErrors).forEach(function (key: any) {
      const keyPair = key as keyof CreditCard;
      const displayableKeyName = key.toLowerCase().replace("card", "Card ");
      if (!selectedCreditCard[keyPair]) {
        newErrors[keyPair] = `${displayableKeyName} value required.`;
        isErrorFlag = true;
      } else {
        newErrors[keyPair] = "";
        isErrorFlag = false;
      }
    });
    if (isErrorFlag) {
      setErrors(newErrors);
      return isErrorFlag;
    }
    //if no blank field then check other validation
    if (selectedCreditCard["cardNumber"].length !== 16) {
      newErrors.cardNumber = "Card number should be 16 digits";
      isErrorFlag = true;
    }
    if (
      selectedCreditCard["cardCvv"].length !== 3 &&
      selectedCreditCard["cardCvv"].length !== 4
    ) {
      newErrors.cardCvv = "Card CVV should be 3 or 4 digits";
      isErrorFlag = true;
    }

    setErrors(newErrors);
    return isErrorFlag;
  };

  return (
    <div className="card-form">
      <div className="card-list">{children}</div>
      <div className="card-form__inner">
        <div className="card-input">
          <label htmlFor="cardNumber" className="card-input__label">
            Card Number
          </label>
          <Form.Control
            type="text"
            name="cardNumber"
            className="card-input__input"
            autoComplete="off"
            onChange={handleFormChangeNumbers}
            maxLength={16}
            value={selectedCreditCard.cardNumber}
            isInvalid={!!errors.cardNumber}
          />
          <Form.Control.Feedback type="invalid">
            {errors.cardNumber}
          </Form.Control.Feedback>
        </div>

        <div className="card-input">
          <label htmlFor="cardName" className="card-input__label">
            Card Holder Name
          </label>
          <Form.Control
            type="text"
            className="card-input__input"
            autoComplete="off"
            name="cardHolder"
            onChange={handleFormChange}
            value={selectedCreditCard.cardHolder}
            isInvalid={!!errors.cardHolder}
          />
          <Form.Control.Feedback type="invalid">
            {errors.cardHolder}
          </Form.Control.Feedback>
        </div>

        <div className="card-form__row">
          <div className="card-form__col">
            <div className="card-form__group">
              <label htmlFor="cardMonth" className="card-input__label">
                Expiration Date
              </label>

              <Form.Control
                as="select"
                className="card-input__input -select"
                value={selectedCreditCard.cardMonth}
                name="cardMonth"
                onChange={handleFormChange}
                isInvalid={!!errors.cardMonth}
              >
                <option value="" disabled>
                  Month
                </option>

                {monthsArr.map((val, index) => (
                  <option key={index} value={val}>
                    {val}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.cardMonth}
              </Form.Control.Feedback>
              <Form.Control
                as="select"
                name="cardYear"
                className="card-input__input -select"
                value={selectedCreditCard.cardYear}
                onChange={handleFormChange}
                isInvalid={!!errors.cardYear}
              >
                <option value="" disabled>
                  Year
                </option>

                {yearsArr.map((val, index) => (
                  <option key={index} value={val}>
                    {val}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.cardYear}
              </Form.Control.Feedback>
            </div>
          </div>
          <div className="card-form__col -cvv">
            <div className="card-input">
              <label htmlFor="cardCvv" className="card-input__label">
                CVV (Security Code)
              </label>
              <Form.Control
                type="text"
                className="card-input__input"
                maxLength={4}
                autoComplete="off"
                name="cardCvv"
                value={selectedCreditCard.cardCvv}
                onChange={handleFormChangeNumbers}
                onFocus={onCvvFocus}
                onBlur={onCvvBlur}
                isInvalid={!!errors.cardCvv}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cardCvv}
              </Form.Control.Feedback>
            </div>
          </div>
        </div>
        <div className="card-form__row">
          <div className="card-input">
            <label htmlFor="cardCountry" className="card-input__label">
              Country
            </label>
            <Form.Control
              as="select"
              className="card-input__input -select"
              value={selectedCountry}
              name="cardCountry"
              onChange={(event) => {
                handleCountryChange(event);
                handleFormChange(event);
              }}
            >
              <option value="" disabled>
                {selectedCreditCard.cardCountry
                  ? selectedCreditCard.cardCountry
                  : "Select Country"}
              </option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </Form.Control>
          </div>
        </div>
        <div className="card-form__row">
          <div className="card-form__col">
            <div className="d-grid gap-2">
              <Button variant="primary" size="lg" onClick={handleConfirmAction}>
                Confirm
              </Button>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
