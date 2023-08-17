import { Fragment, useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../components/Card";
import CardForm from "../../components/CardForm";
import {
  CreditCard,
  fetchCreditCardList,
  updatesessionStorageCards,
} from "../CreditCard";

const initialState: CreditCard = {
  id: "",
  cardNumber: "",
  cardCountry: "",
  cardHolder: "",
  cardMonth: "",
  cardYear: "",
  cardCvv: "",
};

export default function EditCard() {
  const { id: parmId } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<CreditCard>(initialState);
  const [cardsData, setCardsData] = useState<CreditCard[]>([]);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parmId]);

  async function fetchData() {
    const cards: CreditCard[] = await fetchCreditCardList();
    setCardsData(cards);
    if (cards && cards.length > 0) {
      const selectedCard = cards.find((card) => card.id === parmId);
      setState(selectedCard ?? initialState);
    }
  }

  const updateStateValues = useCallback(
    (keyName, value) => {
      if (keyName === "cardCountry") {
        setState({
          ...state,
          cardCountry: value,
        });
      } else {
        setState({
          ...state,
          [keyName]: value || "",
        });
      }
    },
    [state]
  );

  function handleSubmitAction() {
    try {
      const cards: CreditCard[] = cardsData;
      const selectedCard: CreditCard =
        cards.find((card) => card.id === parmId) ?? initialState;
      const selectedCardIndex = cards.indexOf(selectedCard);
      cards[selectedCardIndex] = state;
      updatesessionStorageCards(cards);
      navigate("/");
    } catch (error: any) {
      alert(error);
      console.log(error);
    }
  }

  function handleDeleteAction() {
    try {
      // eslint-disable-next-line no-restricted-globals
      if (confirm("Are you sure you want to delete this card?") === false) {
        return;
      }

      const cards: CreditCard[] = cardsData;
      const selectedCard: CreditCard =
        cards.find((card) => card.id === parmId) ?? initialState;
      const selectedCardIndex = cards.indexOf(selectedCard);
      cards.splice(selectedCardIndex, 1);
      updatesessionStorageCards(cards);
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
      <Container>
        <Row className="justify-content-center">
          <Col md={3} className="">
            <div className="d-grid gap-1 delete-card">
              <Button variant="link" size="lg" onClick={handleDeleteAction}>
                Delete Card
              </Button>{" "}
            </div>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}
