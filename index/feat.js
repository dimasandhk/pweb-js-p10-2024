fetch("https://dummyjson.com/products?limit=15")
    .then((res) => res.json())
    .then(console.log);
