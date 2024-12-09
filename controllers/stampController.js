// controllers/stampController.js
const getStamps = (req, res) => {
    const category = req.params.category;

    // Mock stamp data
    const stampCollections = {
        'rare-stamps': [
            { name: 'Penny Black', description: 'First adhesive postage stamp', image: 'https://placehold.co/200' },
            { name: 'Inverted Jenny', description: 'Rare American stamp', image: 'https://placehold.co/200' },
            { name: 'Treskilling Yellow', description: 'Rare Swedish stamp', image: 'https://placehold.co/200' },
            { name: 'Mauritius Post Office', description: 'Historic island stamp', image: 'https://placehold.co/200' }
        ],
        'historical-collection': [
            { name: 'World War II Commemoration', description: '1945 memorial stamp', image: 'https://placehold.co/200' },
            { name: 'Moon Landing', description: 'First lunar landing stamp', image: 'https://placehold.co/200' },
            { name: 'Olympic Games', description: 'Historic Olympic moments', image: 'https://placehold.co/200' }
        ],
        'thematic-stamps': [
            { name: 'Wildlife Series', description: 'Endangered species', image: 'https://placehold.co/200' },
            { name: 'Space Exploration', description: 'Cosmic themes', image: 'https://placehold.co/200' },
            { name: 'Art Masters', description: 'Famous paintings', image: 'https://placehold.co/200' }
        ],
        'modern-releases': [
            { name: 'Digital Era', description: 'Tech-themed stamps', image: 'https://placehold.co/200' },
            { name: 'Climate Change', description: 'Environmental awareness', image: 'https://placehold.co/200' }
        ],
        'international-series': [
            { name: 'World Cultures', description: 'Global heritage', image: 'https://placehold.co/200' },
            { name: 'United Nations', description: 'UN commemorative', image: 'https://placehold.co/200' }
        ]
    };

    const stamps = stampCollections[category];

    if (stamps) {
        res.status(200).json(stamps); // Send stamps as JSON
    } else {
        res.status(404).json({ error: 'Category not found' });
    }
};

module.exports = { getStamps };
