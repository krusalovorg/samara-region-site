export const getCookieToken = ()=>document.cookie.split('; ').find(row => row.startsWith('access_token='));
export const getImage = (image: string)=>`http://127.0.0.1:5000/image/${image}`