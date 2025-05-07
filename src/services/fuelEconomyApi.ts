const BASE_URL = 'https://www.fueleconomy.gov/ws/rest';

export interface MenuItem {
  text: string;
  value: string;
}

export interface VehicleDetails {
  id: string;
  fuelEfficiency: number;
}

const parseXmlResponse = async (response: Response): Promise<MenuItem[]> => {
  const text = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");
  const menuItems = xmlDoc.getElementsByTagName("menuItem");
  const items: MenuItem[] = [];
  
  for (let i = 0; i < menuItems.length; i++) {
    const item = menuItems[i];
    const text = item.getElementsByTagName("text")[0]?.textContent || '';
    const value = item.getElementsByTagName("value")[0]?.textContent || '';
    items.push({ text, value });
  }
  
  return items;
};

const parseVehicleDetails = async (response: Response): Promise<VehicleDetails> => {
  const text = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");
  
  // Get the vehicle ID from the first menuItem
  const menuItem = xmlDoc.getElementsByTagName("menuItem")[0];
  const id = menuItem?.getElementsByTagName("value")[0]?.textContent || '';
  
  // Fetch the vehicle details using the ID
  const detailsResponse = await fetch(`${BASE_URL}/vehicle/${id}`);
  const detailsText = await detailsResponse.text();
  const detailsDoc = parser.parseFromString(detailsText, "text/xml");
  
  // Get the combined fuel efficiency in MPG
  const mpg = detailsDoc.getElementsByTagName("comb08")[0]?.textContent;
  const fuelEfficiency = mpg ? parseFloat(mpg) : 0;
  
  return {
    id,
    fuelEfficiency
  };
};

export const getYears = async (): Promise<MenuItem[]> => {
  const response = await fetch(`${BASE_URL}/vehicle/menu/year`);
  return parseXmlResponse(response);
};

export const getMakes = async (year: string): Promise<MenuItem[]> => {
  const response = await fetch(`${BASE_URL}/vehicle/menu/make?year=${year}`);
  return parseXmlResponse(response);
};

export const getModels = async (year: string, make: string): Promise<MenuItem[]> => {
  const response = await fetch(`${BASE_URL}/vehicle/menu/model?year=${year}&make=${make}`);
  return parseXmlResponse(response);
};

export const getVehicleDetails = async (year: string, make: string, model: string): Promise<VehicleDetails> => {
  const response = await fetch(`${BASE_URL}/vehicle/menu/options?year=${year}&make=${make}&model=${model}`);
  return parseVehicleDetails(response);
}; 