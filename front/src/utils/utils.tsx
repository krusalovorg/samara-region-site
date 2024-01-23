import { URL_SERVER } from "./backend";

export const getCookieToken = () => {
    let res = document.cookie.split("; ").find((row) => row.startsWith("access_token="))
    if (res) {
        res = res.replace("access_token=", "");
    }
    return res;
};
export const getImage = (image: string) => URL_SERVER+`/image/${image}`

export function declOfHours(number: number) {
    if (number === 1) {
        return 'час';
    } else if (number >= 2 && number <= 4) {
        return 'часа';
    } else {
        return 'часов';
    }
}