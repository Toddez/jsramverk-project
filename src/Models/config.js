const domain = window.location.href.split('://');

let api_url = 'https://project-api.teo-jsramverk.me';
let socket_url = 'https://project-socket.teo-jsramverk.me';

if (domain[1].includes('localhost') ||
    domain[1].includes('127.0.0.1')) {
    api_url = 'http://localhost:1337';
    socket_url = 'http://localhost:3001';
}

export { api_url, socket_url };
export default { api_url, socket_url };
