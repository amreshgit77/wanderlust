
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1ydTc3IiwiYSI6ImNtajBjMjZoczA2cnozZnNibWM4OXY3ZDcifQ.73Nd8Q9NIsWZpoRKMmfgqw';
console.log(mapboxgl.accessToken);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});


const marker = new mapboxgl.Marker()
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(`<h3>${listing.title}</h3><p>exact location will be provided after booking</p>`))
    .addTo(map);