import { Fragment, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import Card from "../../components/Card";
import CardForm from "../../components/CardForm";
import { CreditCard, updatesessionStorageCards } from "../CreditCard";

const initialState: CreditCard = {
  id: "",
  cardNumber: "",
  cardHolder: "",
  cardMonth: "",
  cardYear: "",
  cardCvv: "",
  cardCountry: "",
};

export default function AddCard() {
  const navigate = useNavigate();
  const [state, setState] = useState<CreditCard>(initialState);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const updateStateValues = useCallback(
    (key, value) => {
      setState({
        ...state,
        [key]: value || "",
      });
    },
    [state]
  );

  function handleSubmitAction() {
    try {
      let newCardsList: CreditCard[] = [];
      if (sessionStorage.getItem("cards")) {
        const storageCards = JSON.parse(sessionStorage.getItem("cards") ?? "");
        newCardsList = storageCards ? [...storageCards] : [];
      }

      newCardsList.push({
        ...state,
        id: uuid(),
      });
      updatesessionStorageCards(newCardsList);
      navigate("/");
    } catch (error: any) {
      alert(error);
      console.log(error);
    }
  }

  return (
    <Fragment>
      <div className="add-card-content">
        <div className="wrapper">
          <CardForm
            selectedCreditCard={state}
            onUpdateState={updateStateValues}
            setIsCardFlipped={setIsCardFlipped}
            handleSubmitAction={handleSubmitAction}
          >
            <Card
              cardNumber={state.cardNumber}
              cardHolder={state.cardHolder}
              cardMonth={state.cardMonth}
              cardYear={state.cardYear}
              cardCvv={state.cardCvv}
              cardCountry={state.cardCountry}
              isCardFlipped={isCardFlipped}
            ></Card>
          </CardForm>
        </div>
      </div>
    </Fragment>
  );
}
