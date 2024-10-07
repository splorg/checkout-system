export interface IEvent {
  id: string;
  name: string;
  imageUrl: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface IProduct {
  id: string;
  name: string;
  eventId: string;
  title: string;
  price: number;
  imageUrl: string;
}
