const fetch = require('node-fetch');

async function checkCounts() {
    try {
        const res = await fetch('http://127.0.0.1:5000/products');
        const products = await res.json();
        const counts = {};
        products.forEach(p => {
            const key = `${p.category} > ${p.subcategory}`;
            counts[key] = (counts[key] || 0) + 1;
        });
        console.log(JSON.stringify(counts, null, 2));
        
        const catCounts = {};
        products.forEach(p => {
            catCounts[p.category] = (catCounts[p.category] || 0) + 1;
        });
        console.log("Category Counts:");
        console.log(JSON.stringify(catCounts, null, 2));
    } catch (e) {
        console.error("Error fetching products:", e.message);
    }
}

checkCounts();
