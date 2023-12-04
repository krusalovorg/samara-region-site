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
    points: string;
};

export type Place = {
    id: number;
    name: string;
    card_description: string;
    description: string;
    category: string;
    images: string;
    coordinates: string;
    rate: number;
    price: number;
    city: string;
    location: string;
    walk: boolean;
    time: number;
};

const url_stat = "http://127.0.0.1:5000"

export async function getData(route: "places" | "routes" | "category", category?: string) {
    let url = url_stat;
    if (route === 'places') {
        if (category) {
            url += `/places?category=${category}`;
        } else {
            url += '/places';
        }
    } else if (route === 'routes') {
        url += '/routes';
    } else if (route === 'category') {
        url += '/category';
    } else {
        throw new Error('Invalid route');
    }

    try {
        console.log('fetch url:', url)
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('data:', data)
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

export async function getItemById(id: string, category: "places" | "routes" | "category") {
    try {
        const url = url_stat + `/get_details_id?id=${id}&table_name=${category}`;
        console.log('fetch url:', url)
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('data:', data)
        return data as Place;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}