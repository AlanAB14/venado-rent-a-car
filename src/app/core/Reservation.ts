export interface Reservation {
  id:          number;
  date_start:  Date;
  date_end:    Date;
  total_price: string;
  name:        string;
  email:       string;
  phone:       string;
  car_name:    string;
}
