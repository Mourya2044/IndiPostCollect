// Mock stamp data
const stampCollections = require('../public/stampCollecions.json');

const getStamps = (req, res) => {
    const category = req.params.category;
    // console.log(category);
    
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


