const BASE_URL = 'https://www.fueleconomy.gov/ws/rest';

export interface MenuItem {
  text: string;
  value: string;
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

export const getVehicleDetails = async (year: string, make: string, model: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}/vehicle/menu/options?year=${year}&make=${make}&model=${model}`);
  return parseXmlResponse(response);
}; 