export type Category = {
    id: number;
    name: string;
    card_description: string;
    description: string;
};

export type Route = {
    id: number;
    name: string;
    card_description: string;
    description: string;
    category: string;
    images: string;
    points: Place[];
};

export type Place = {
    id: number;
    name: string;
    card_description: string;
    description: string;
    category: Category[] | string;
    images: string;
    coordinates: string;
    rate: number;
    price: number;
    city: string;
    location: string;
    walk: boolean;
    time: number;
};

export const URL_SERVER = "http://5.35.93.250:5000"

export async function getData(route: "places" | "routes" | "category", category?: string | number, time?: number) {
    let url = URL_SERVER;
    if (route === 'places' || route === 'routes') {
        if (category) {
            url += `/${route}?category=${category}&time=${time||24}`;
        } else {
            url += '/'+route;
        }
    } else if (route === 'category') {
        url += '/category';
    } else {
        throw new Error('Invalid route');
    }

    try {
        console.log('fetch url:', url)
        const response = await fetch(url, { method: "GET", headers: { 'Content-Type': 'application/json' } });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        //console.log('data:', data)
        if (route === 'places') {
            return data as Place[];
        } else if (route === 'routes') {
            return data as Route[];
        } else if (route === 'category') {
            return data as Category[];
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function requestData(url: string) { 
    const response = await fetch(url); 
    if (!response.ok) { 
        throw new Error('Network response was not ok'); 
    } 
    return response.json(); 
}

export async function getItemById(id: string, category: "places" | "routes" | "category") { 
    try { 
        const url = `${URL_SERVER}/get_details_id?id=${id}&table_name=${category}`; 
        console.log('fetch url:', url) 
        const data = await requestData(url); 
        //console.log('data:', data) 
        return data as Place; 
    } catch (error) { 
        console.error('Error fetching data:', error); 
        throw error; 
    } 
} 

export async function deleteById(id: number, category: "places" | "routes" | "category") { 
    try { 
        const url = `${URL_SERVER}/delete?id=${id}&table_name=${category}`; 
        console.log('fetch url:', url) 
        const data = await requestData(url); 
        //console.log('data:', data) 
        return data as Place; 
    } catch (error) { 
        console.error('Error fetching data:', error); 
        throw error; 
    } 
}

export async function getItemsById(id: string[], category: "places" | "routes" | "category") {
    let result: any[] = [];
    for (const item of id) {
        const res = await getItemById(item, category);
        result.push(res);
    }
    return result;
}