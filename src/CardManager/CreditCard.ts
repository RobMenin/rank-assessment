export interface CreditCard {
  cardCountry?: string;
  id: string;
  cardNumber: string;
  cardHolder: string;
  cardMonth: string;
  cardYear: string;
  cardCvv: string;
}
export interface AddEditCard extends CreditCard {
  isCardFlipped: boolean;
}

//Data Layer
export class CreditCardAPI {
  async fetchCreditCardList(): Promise<CreditCard[]> {
    const apiData: CreditCard[] = [];
    let creditCardsList: CreditCard[] = [];
    if (sessionStorage.getItem("cards")) {
      const sessionStorageData: CreditCard[] = JSON.parse(
        sessionStorage.getItem("cards") ?? ""
      );
      creditCardsList = [...sessionStorageData];
    } else {
      creditCardsList = [...apiData];
      updatesessionStorageCards(creditCardsList);
    }

    return creditCardsList;
  }
}

//Business Layer
export async function fetchCreditCardList(): Promise<CreditCard[]> {
  const api = new CreditCardAPI();
  return api.fetchCreditCardList();
}
export function updatesessionStorageCards(cards: CreditCard[]) {
  sessionStorage.setItem("cards", JSON.stringify(cards));
}
