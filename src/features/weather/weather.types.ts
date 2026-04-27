export type City = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin3_id: number;
  admin4_id: number;
  timezone: string;
  population: number;
  postcodes: string[];
  country_id: number;
  country: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
};

export type GeocodingResponse = {
  results: City[];
};

// {
//   "results": [
//     {
//       "id": 2950159,
//       "name": "Berlin",
//       "latitude": 52.52437,
//       "longitude": 13.41053,
//       "elevation": 74,
//       "feature_code": "PPLC",
//       "country_code": "DE",
//       "admin1_id": 2950157,
//       "admin3_id": 6547383,
//       "admin4_id": 6547539,
//       "timezone": "Europe/Berlin",
//       "population": 3426354,
//       "postcodes": [
//         "10967",
//         "13347"
//       ],
//       "country_id": 2921044,
//       "country": "Germany",
//       "admin1": "State of Berlin",
//       "admin3": "Berlin, Stadt",
//       "admin4": "Berlin"
//     }
//   ]
// }
