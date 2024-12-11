// Mock stamp data
const stampCollections = {
    'rare-stamps': [
        { id: '1', name: 'Penny Black', description: 'First adhesive postage stamp', image: '/images/stamps/penny-black.jpeg' },
        { id: '2', name: 'Inverted Jenny', description: 'Rare American stamp', image: '/images/stamps/inverted-jenny.jpeg' },
        { id: '3', name: 'Treskilling Yellow', description: 'Rare Swedish stamp', image: '/images/stamps/Treskilling-Yellow.jpeg' },
        { id: '4', name: 'Mauritius Post Office', description: 'Historic island stamp', image: '/images/stamps/Mauritius-Post-Office.jpeg' }
    ],
    'historical-collection': [
        { id: '5', name: 'British India 1941 Post Mail', description: '1941 POSTAL MAIL ISSUE 6 SIX ANNA MAIL STEAMER', image: '/images/stamps/BRITISH INDIA 1941 POSTAL MAIL ISSUE 6 SIX ANNA MAIL STEAMER.png' },
        { id: '6', name: 'King George', description: 'india 1937 king george VI 5 Re Service Postage stamp', image: '/images/stamps/india 1937 king george VI 5 Re Service Postage stamp.png' },
        { id: '7', name: 'Hyderabad', description: 'Postage & Reciept Stamp of Hyderabad State 1 Anna', image: '/images/stamps/Postage & Reciept Stamp of Hyderabad State 1 Anna Black-N-White.png' }
    ],
    'thematic-stamps': [
        { id: '8', name: 'Wildlife Series', description: 'Endangered species', image: '/images/stamps/475_Tiger.png' },
        { id: '9', name: 'Space Exploration', description: 'Cosmic themes', image: '/images/stamps/space.jpeg' },
        { id: '10', name: 'Others', description: 'Famous paintings', image: '/images/stamps/Passport_photo.png' }
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


