export const mapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] }, // Lighter background for map
    { elementType: 'labels.text.fill', stylers: [{ color: '#555555' }] }, // Lighter label text
    { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] }, // Lighter label stroke

    // Locality labels
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#2e2e2e' }], // Darker color for locality text
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#2e2e2e' }], // Darker color for POI text
    },

    // Parks
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#a8d08d' }], // Light green for parks
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#4c9a2a' }], // Dark green text for parks
    },

    // Roads (lighter colors)
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#d9d9d9' }], // Light grey for roads
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#c0c0c0' }], // Lighter road borders
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#666666' }], // Lighter grey text for road labels
    },

    // Highway (lighter colors)
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#f4e1a1' }], // Very light yellow for highways
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#d1d1a3' }], // Lighter highway stroke
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#4d4d4d' }], // Darker text for highway labels
    },

    // Transit
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#d0d0d0' }], // Light grey for transit
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#3c3c3c' }], // Dark grey text for transit stations
    },

    // Water
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#b0c4de' }], // Light blue for water
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#3f4e5c' }], // Darker text for water labels
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#ffffff' }], // Light stroke for water labels
    },
];
