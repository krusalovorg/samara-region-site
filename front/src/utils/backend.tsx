export type Category = {
    _id: any;
    name: string;
    card_description: string;
    description: string;
};

export type Route = {
    _id: any;
    name: string;
    card_description: string;
    description: string;
    category: string;
    images: string;
    points: Place[];
};

export type Place = {
    _id: any;
    name: string;
    card_description: string;
    description: string;
    category: Category[] | string;
    image: string;
    coordinates: string;
    rate: number;
    price: number;
    city: string;
    location: string;
    walk: boolean;
    time: number;
};

export const URL_SERVER = "http://localhost:5000";
export const URL_SITE = "http://localhost";

export async function getData(route: "places" | "routes" | "category", category?: string | number, time?: number) {
    let url = URL_SERVER;
    console.log('category',category)
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

export async function deleteById(id: number, category: "places" | "routes" | "category", token: string) { 
    try { 
        const url = `${URL_SERVER}/delete?id=${id}&table_name=${category}`; 
        console.log('fetch url:', url) 

        const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }); 
        if (!response.ok) { 
            throw new Error('Network response was not ok'); 
        } 
        const data = await response.json(); 
    
        //console.log('data:', data) 
        return data as Place; 
    } catch (error) { 
        console.error('Error fetching data:', error); 
        throw error; 
    } 
}

export async function getItemsById(ids: string[], category: "places" | "routes" | "category") {
    let result: any[] = [];
    for (const item of ids) {
        const res = await getItemById(item, category);
        result.push(res);
    }
    return result;
}

interface Favorites {
    places: string[];
    routes: string[];
}

export type UserData = {
    name: string;
    email: string;
    role: 'user' | 'admin' | 'none';
    favorites: Favorites;
    _id?: any;
};

export const getUserData = async (token: string) => {
    try {
        console.log('tooken get', token)
        const response = await fetch(URL_SERVER + "/get_full_user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            }
        });
        const data = await response.json();
        return data as UserData;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};


export const addFavotiteItem = async (token: string, item_id: string, route: boolean) => {
    try {
        console.log('tooken get', token)
        const response = await fetch(URL_SERVER + "/add_favorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                [route ? 'route_id' : 'place_id']: item_id
            })
        });
        const data = await response.json();
        return data as {status: boolean};
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};