// Mock stamp data
const stampCollections = {
    'rare-stamps': [
        { id: '1', name: 'Penny Black', description: 'First adhesive postage stamp', image: '/images/stamps/penny-black.jpeg' },
        { id: '2', name: 'Inverted Jenny', description: 'Rare American stamp', image: '/images/stamps/inverted-jenny.jpeg' },
        { id: '3', name: 'Treskilling Yellow', description: 'Rare Swedish stamp', image: '/images/stamps/Treskilling-Yellow.jpeg' },
        { id: '4', name: 'Mauritius Post Office', description: 'Historic island stamp', image: '/images/stamps/Mauritius-Post-Office.jpeg' }
    ],
    'historical-collection': [
        { id: '5', name: 'World War II Commemoration', description: '1945 memorial stamp', image: 'https://placehold.co/200' },
        { id: '6', name: 'Moon Landing', description: 'First lunar landing stamp', image: 'https://placehold.co/200' },
        { id: '7', name: 'Olympic Games', description: 'Historic Olympic moments', image: 'https://placehold.co/200' }
    ],
    'thematic-stamps': [
        { id: '8', name: 'Wildlife Series', description: 'Endangered species', image: 'https://placehold.co/200' },
        { id: '9', name: 'Space Exploration', description: 'Cosmic themes', image: 'https://placehold.co/200' },
        { id: '10', name: 'Art Masters', description: 'Famous paintings', image: 'https://placehold.co/200' }
    ],
    'modern-releases': [
        { id: '11', name: 'Digital Era', description: 'Tech-themed stamps', image: 'https://placehold.co/200' },
        { id: '12', name: 'Climate Change', description: 'Environmental awareness', image: 'https://placehold.co/200' }
    ],
    'international-series': [
        { id: '13', name: 'World Cultures', description: 'Global heritage', image: 'https://placehold.co/200' },
        { id: '14', name: 'United Nations', description: 'UN commemorative', image: 'https://placehold.co/200' }
    ]
};


const getStamps = (req, res) => {
    const category = req.params.category;
    console.log(category);
    
    if (category!='all') {
        const stamps = stampCollections[category];
        if (stamps) {
            res.status(200).json(stamps); // Send stamps for the specific category
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } else {
        // Combine all stamps from all categories into a single array
        const allStamps = Object.values(stampCollections).flat();
        res.status(200).json(allStamps); // Send all stamps
    }
};

const getStampDetails = (req, res) => {
    const stampId = req.params.id;

    // Search for the stamp in all categories
    let stamp = null;
    for (const category in stampCollections) {
        stamp = stampCollections[category].find(item => item.id === stampId);
        if (stamp) break; // Exit loop if stamp is found
    }

    if (stamp) {
        res.render('stampDetails',  stamp ); // Render the details view with the found stamp
    } else {
        res.status(404).send('Stamp not found');
    }
};

module.exports = { getStamps, getStampDetails };


