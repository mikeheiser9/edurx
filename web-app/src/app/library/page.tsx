// "use client";
// import React, { useState } from 'react';
// import axios from 'axios';
// import cheerio from 'cheerio';

// const ScrapePage: React.FC = () => {
//   const [data, setData] = useState(null);

//   const getInfo = async () => {
//     const result = await axios.get('https://courses.cebroker.com/search/fl/dietitian-nutritionist?tab=courses&profession=36&courseType=1&hours=1&sort=relevance&price=0-1000&priceBucket=1&courseType=1&hours=1&sort=relevance&price=0-1000&priceBucket=1');
//     const $ = cheerio.load(result.data);
//     const parsedData = [];
//     $('p').each((i, elem) => {
//       parsedData[i] = $(elem).text();
//     });
//     return parsedData;
//   };  

//   return (
//     <div>
//       <h1>hi</h1>
//     </div>
//   );
// };

// export default ScrapePage;