
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1ydTc3IiwiYSI6ImNtajBjMjZoczA2cnozZnNibWM4OXY3ZDcifQ.73Nd8Q9NIsWZpoRKMmfgqw';
console.log(mapboxgl.accessToken);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [85.7868, 25.8560], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});
