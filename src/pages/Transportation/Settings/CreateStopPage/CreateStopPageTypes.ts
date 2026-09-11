export interface CreateStopDataProps {
  search: string;
  route: string;
}

export interface CreateStopDataDataTypes {
  id: number;
  routes: string;
  stopName: string;
  slabs: string;
  pickUpTime: string;
  dropTime: string;
}
