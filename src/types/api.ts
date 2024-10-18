export interface ApiTeam {
  id: number;
  name: string;
  accomodation: string;
  street: string;
  housenumber: number;
  housenumber_addition: string;
  postcode: string;
  city: string;
  lat: string;
  long: string;
  area: string;
}

export interface ApiArea {
  name: string;
  status: string;
  updated_at: string;
}

export interface WebHunt {
  area: string;
  huntCode: string;
  status: string;
  points: number;
  huntTime: string;
}

export interface ApiArticle {
  id: number;
  title: string;
  type: string;
  publish_at: string;
  message: {
    content: string;
    type: string;
    max_points: number;
    end_time: string;
  };
}
