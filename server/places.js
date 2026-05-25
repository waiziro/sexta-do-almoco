const OFFICE_LOCATION = {
  lat: -23.5847,
  lng: -46.6733,
  address: 'R. Dr. Eduardo de Souza Aranha, 153 - Itaim Bibi, Sao Paulo'
};

export const SEED_RESTAURANTS = [
  { place_id:"ChIJPRm_I1xXzpQRyhYhYx89jo4", name:"Pão com Carne Hamburgueria",   rating:4.8, review_count:11961, price_level:1, avg_price:"R$ 40",  photo_url:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=280&fit=crop", address:"R. Bandeira Paulista, 478",           cuisine:"Hambúrguer",    walk_time:1  },
  { place_id:"ChIJ-fEux35XzpQRhtNBHGtl2BE", name:"1900 Pizzeria",                  rating:4.7, review_count:635,   price_level:2, avg_price:"R$ 70",  photo_url:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=280&fit=crop", address:"R. Tabapuã, 554",                   cuisine:"Pizza",         walk_time:1  },
  // ── 2 min ────────────────────────────────────────────────────
  { place_id:"ChIJNX3k1PZXzpQRLUefmHq7Shg", name:"Ça-Va Bistrot (Chef Jacquin)",   rating:4.7, review_count:1792,  price_level:3, avg_price:"R$ 120", photo_url:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=280&fit=crop", address:"R. Joaquim Floriano, 466",           cuisine:"Francesa",      walk_time:2  },
  { place_id:"ChIJH9jAIwBXzpQRCh35mTIgDcU", name:"Temperani Trattoria",             rating:4.7, review_count:1396,  price_level:3, avg_price:"R$ 100", photo_url:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=280&fit=crop", address:"R. Joaquim Floriano, 466",           cuisine:"Italiana",      walk_time:2  },
  // ── 3 min ────────────────────────────────────────────────────
  { place_id:"ChIJV5CbSf1XzpQRKDnlWzWltgA", name:"NOTIZIA Pizzeria",                rating:4.9, review_count:256,   price_level:2, avg_price:"R$ 75",  photo_url:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=280&fit=crop", address:"R. Tabapuã, 838",                   cuisine:"Pizza",         walk_time:3  },
  { place_id:"ChIJmcqwGF1XzpQRCKLCgB9BINU", name:"Restaurante Cantaloup",           rating:4.7, review_count:1574,  price_level:4, avg_price:"R$ 180", photo_url:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=280&fit=crop", address:"R. Manuel Guedes, 474",             cuisine:"Contemporânea", walk_time:3  },
  { place_id:"ChIJOxLZS0JXzpQRPBx9q0pHc3c", name:"LOCALE caffè",                    rating:4.6, review_count:832,   price_level:2, avg_price:"R$ 55",  photo_url:"https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=280&fit=crop", address:"R. Manuel Guedes, 349",             cuisine:"Café / Brunch", walk_time:3  },
  { place_id:"ChIJmYwI8dNXzpQRRJ0ENf5itQw", name:"SFORNO Pizzaria",                 rating:4.6, review_count:343,   price_level:2, avg_price:"R$ 70",  photo_url:"https://images.unsplash.com/photo-1548369937-47519962c11a?w=400&h=280&fit=crop", address:"R. Dr. Renato Paes de Barros, 485",  cuisine:"Pizza",         walk_time:3  },
  // ── 4 min ────────────────────────────────────────────────────
  { place_id:"ChIJq98QjmdXzpQRslBbN8cbGBY", name:"Restaurante Cachoeira Natural",   rating:4.6, review_count:2505,  price_level:1, avg_price:"R$ 35",  photo_url:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=280&fit=crop", address:"R. João Cachoeira, 263",             cuisine:"Buffet Natural",walk_time:4  },
  { place_id:"ChIJ6RbWKllXzpQRCwNoXo--OeA", name:"Aze Sushi",                       rating:4.6, review_count:452,   price_level:3, avg_price:"R$ 90",  photo_url:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=280&fit=crop", address:"R. Dr. Renato Paes de Barros, 769",  cuisine:"Japonesa",      walk_time:4  },
  { place_id:"ChIJ-5JxC0NXzpQR_ztxyPC_Mi0", name:"Veritá Saudável",                 rating:4.9, review_count:130,   price_level:2, avg_price:"R$ 45",  photo_url:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=280&fit=crop", address:"R. João Cachoeira, 233",             cuisine:"Saudável",      walk_time:4  },
  { place_id:"ChIJq2abrm9XzpQRUc9uiMs1JLk", name:"Casa Hario Cafeteria & Brunch",   rating:4.6, review_count:421,   price_level:2, avg_price:"R$ 60",  photo_url:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=280&fit=crop", address:"R. Manuel Guedes, 426",             cuisine:"Café / Brunch", walk_time:4  },
  { place_id:"ChIJn7169jxXzpQRjvVxGyDZXkM", name:"Cheirin Bão Itaim",               rating:4.6, review_count:212,   price_level:1, avg_price:"R$ 25",  photo_url:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=280&fit=crop", address:"R. Joaquim Floriano, 385",           cuisine:"Café / Brunch", walk_time:4  },
  // ── 5 min ────────────────────────────────────────────────────
  { place_id:"ChIJV31qv01XzpQRjxSsfCil_c0", name:"East Kitchen & Bar",              rating:4.6, review_count:321,   price_level:2, avg_price:"R$ 80",  photo_url:"https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=280&fit=crop", address:"R. Leopoldo Couto Magalhães Jr, 382",cuisine:"Asiática",      walk_time:5  },
  { place_id:"ChIJIUkGXENXzpQRvdmAqjnwm04", name:"Barakah Cozinha Árabe",           rating:4.6, review_count:1032,  price_level:2, avg_price:"R$ 65",  photo_url:"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=280&fit=crop", address:"R. Manuel Guedes, 499",             cuisine:"Árabe",         walk_time:5  },
  { place_id:"ChIJAQAwQ1lXzpQRnMUBLcOidrk", name:"Mania de Churrasco",              rating:4.8, review_count:5621,  price_level:2, avg_price:"R$ 55",  photo_url:"https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=280&fit=crop", address:"Av. Pres. Juscelino Kubitschek, 500",cuisine:"Churrascaria",  walk_time:5  },
  { place_id:"ChIJ0ZLehEVXzpQR1C3AQDbVSTA", name:"Malakut Árabe",                   rating:4.6, review_count:612,   price_level:2, avg_price:"R$ 40",  photo_url:"https://images.unsplash.com/photo-1544181290-9748b36a0b87?w=400&h=280&fit=crop", address:"R. Dr. Renato Paes de Barros, 187",  cuisine:"Árabe",         walk_time:5  },
  { place_id:"ChIJQc9P061XzpQRJHneGo9fhoM", name:"Raus Café",                        rating:5.0, review_count:122,   price_level:1, avg_price:"R$ 20",  photo_url:"https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=280&fit=crop", address:"Av. Pres. Juscelino Kubitschek, 510",cuisine:"Café / Brunch", walk_time:5  },
  { place_id:"ChIJTbexBLtXzpQRgOfW9f47axg", name:"Primo Basílico",                  rating:4.9, review_count:2670,  price_level:2, avg_price:"R$ 65",  photo_url:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=280&fit=crop", address:"R. Prof. Carlos de Carvalho, 181",   cuisine:"Pizza",         walk_time:5  },
  { place_id:"ChIJxYvPf-VXzpQR0iq7zS5xB5g", name:"Jamie Oliver Kitchen",            rating:4.7, review_count:750,   price_level:3, avg_price:"R$ 100", photo_url:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=280&fit=crop", address:"Av. Horácio Lafer, 61",              cuisine:"Contemporânea", walk_time:5  },
  // ── 6 min ────────────────────────────────────────────────────
  { place_id:"ChIJhXl10hZXzpQRrDFNUVkqKio", name:"Lolla Meets Fire",                rating:4.8, review_count:2360,  price_level:3, avg_price:"R$ 130", photo_url:"https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=280&fit=crop", address:"R. Manuel Guedes, 545",             cuisine:"Contemporânea", walk_time:6  },
  { place_id:"ChIJ3b4kEmhXzpQRwBDFpaWJBFA", name:"Le Bife",                          rating:4.6, review_count:5368,  price_level:3, avg_price:"R$ 130", photo_url:"https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=280&fit=crop", address:"R. Pedroso Alvarenga, 1088",         cuisine:"Steakhouse",    walk_time:6  },
  // ── 7 min ────────────────────────────────────────────────────
  { place_id:"ChIJhQfhyGBXzpQR2XWsDpbEk1s", name:"Barbacoa",                        rating:4.6, review_count:7912,  price_level:4, avg_price:"R$ 180", photo_url:"https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=280&fit=crop", address:"R. Dr. Renato Paes de Barros, 65",   cuisine:"Churrascaria",  walk_time:7  },
  // ── 8 min ────────────────────────────────────────────────────
  { place_id:"ChIJyyNhOr9ZzpQRAQ3V8QAOzkc", name:"Rubaiyat Faria Lima",             rating:4.6, review_count:2583,  price_level:4, avg_price:"R$ 200", photo_url:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=280&fit=crop", address:"Av. Brigadeiro Faria Lima, 2954",    cuisine:"Churrascaria",  walk_time:8  },
  { place_id:"ChIJpanwHGlXzpQRplb2pDf6YJo", name:"Osaka Japanese Cuisine",          rating:4.6, review_count:1219,  price_level:4, avg_price:"R$ 150", photo_url:"https://images.unsplash.com/photo-1617196034099-2ef4f1e76a00?w=400&h=280&fit=crop", address:"R. Amauri, 234",                     cuisine:"Japonesa",      walk_time:8  },
  // ── 9 min ────────────────────────────────────────────────────
  { place_id:"ChIJudGRTqlXzpQREVAtEK_RBDc", name:"Boteco Macaxeira",                rating:4.6, review_count:3329,  price_level:2, avg_price:"R$ 60",  photo_url:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=280&fit=crop", address:"R. Bandeira Paulista, 1076",         cuisine:"Nordestina",    walk_time:9  },
  { place_id:"ChIJMSJ30WdXzpQR3QtMAL5T3AE", name:"Da Marino",                       rating:4.7, review_count:2538,  price_level:3, avg_price:"R$ 110", photo_url:"https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&h=280&fit=crop", address:"R. Jerônimo da Veiga, 74",           cuisine:"Italiana",      walk_time:9  },
  // ── 10 min ───────────────────────────────────────────────────
  { place_id:"ChIJGfibHgBXzpQRo58S9VSH0xw", name:"Gusto Cucina Itaim",             rating:5.0, review_count:997,   price_level:3, avg_price:"R$ 120", photo_url:"https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&h=280&fit=crop", address:"R. Pais de Araújo, 168",             cuisine:"Italiana",      walk_time:10 },
  { place_id:"ChIJBe6rgMJXzpQRdGBte6uWC2E", name:"El Toro Steakhouse",             rating:4.7, review_count:377,   price_level:3, avg_price:"R$ 110", photo_url:"https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=280&fit=crop", address:"R. Dr. Mário Ferraz, 351",           cuisine:"Steakhouse",    walk_time:10 },
  { place_id:"ChIJKyOteERXzpQRhyCue5JqNUM", name:"JAM Itaim",                      rating:4.7, review_count:2441,  price_level:4, avg_price:"R$ 160", photo_url:"https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&h=280&fit=crop", address:"R. Lopes Neto, 308",                 cuisine:"Japonesa",      walk_time:10 },
  { place_id:"ChIJv5CU_kFXzpQRAD-4fc89qPA", name:"Loup Restaurant",                rating:4.7, review_count:1126,  price_level:3, avg_price:"R$ 130", photo_url:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=280&fit=crop", address:"R. Dr. Mário Ferraz, 528",           cuisine:"Contemporânea", walk_time:10 },
  // ── 11 min ───────────────────────────────────────────────────
  { place_id:"ChIJXXAo52dXzpQRdeK4IWo4W2s", name:"Modern Mamma Osteria",           rating:4.7, review_count:6426,  price_level:3, avg_price:"R$ 100", photo_url:"https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=400&h=280&fit=crop", address:"R. Manuel Guedes, 160",             cuisine:"Italiana",      walk_time:11 },
  { place_id:"ChIJyxIBZ0FXzpQRcV9VUI3gT2Q", name:"Torero Valese (Tapas)",          rating:4.6, review_count:1311,  price_level:3, avg_price:"R$ 95",  photo_url:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=280&fit=crop", address:"Av. Horácio Lafer, 638",              cuisine:"Espanhola",     walk_time:11 },
  // ── 12 min ───────────────────────────────────────────────────
  { place_id:"ChIJC8CxM5xXzpQRBnKNqBwtjSY", name:"Forno da Pino",                  rating:4.7, review_count:2209,  price_level:2, avg_price:"R$ 85",  photo_url:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=280&fit=crop", address:"R. Jerônimo da Veiga, 75",           cuisine:"Italiana",      walk_time:12 },
  { place_id:"ChIJn__C22dXzpQRD3Ll72W-Tqk", name:"Due Cuochi Cucina",              rating:4.7, review_count:2306,  price_level:3, avg_price:"R$ 110", photo_url:"https://images.unsplash.com/photo-1552566626-52f8b828329e?w=400&h=280&fit=crop", address:"R. Manuel Guedes, 93",               cuisine:"Italiana",      walk_time:12 },
  // ── 13 min ───────────────────────────────────────────────────
  { place_id:"ChIJBZ8WvVVXzpQR62j5LttNdbU", name:"Jet Pizzas Faria Lima",          rating:4.6, review_count:186,   price_level:1, avg_price:"R$ 40",  photo_url:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=280&fit=crop", address:"Av. Brigadeiro Faria Lima, 4199",    cuisine:"Pizza",         walk_time:13 },
  // ── 14 min ───────────────────────────────────────────────────
  { place_id:"ChIJV_kPDC1XzpQR9N5igCH3TK4", name:"HAO Sushi Itaim",               rating:4.8, review_count:865,   price_level:2, avg_price:"R$ 80",  photo_url:"https://images.unsplash.com/photo-1617196034099-2ef4f1e76a00?w=400&h=280&fit=crop", address:"R. João Cachoeira, 1556",             cuisine:"Japonesa",      walk_time:14 },
];

export async function searchNearby(apiKey, options = {}) {
  const { minRating = 4.6, minReviews = 200, maxWalkTime = 15 } = options;

  if (apiKey) {
    try {
      const radius = maxWalkTime * 80;
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${OFFICE_LOCATION.lat},${OFFICE_LOCATION.lng}&radius=${radius}&type=restaurant&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.results) {
        const filtered = data.results
          .filter(place => place.rating >= minRating && place.user_ratings_total >= minReviews)
          .map(place => ({
            place_id: place.place_id,
            name: place.name,
            rating: place.rating,
            review_count: place.user_ratings_total,
            price_level: place.price_level || 2,
            avg_price: formatPrice(place.price_level),
            photo_url: place.photos?.[0]
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
              : null,
            address: place.vicinity,
            cuisine: place.types?.includes('japanese_restaurant') ? 'Japonesa'
              : place.types?.includes('italian_restaurant') ? 'Italiana'
              : place.types?.includes('brazilian_restaurant') ? 'Brasileira'
              : 'Restaurante',
            walk_time: estimateWalkTime(place.geometry?.location)
          }));
        return filtered;
      }
    } catch (err) {
      console.error('Google Places API error, falling back to mock data:', err.message);
    }
  }

  return SEED_RESTAURANTS.filter(
    r => r.rating >= minRating && r.review_count >= minReviews && r.walk_time <= maxWalkTime
  );
}

function formatPrice(priceLevel) {
  const prices = { 1: 'R$ 30', 2: 'R$ 50', 3: 'R$ 80', 4: 'R$ 120' };
  return prices[priceLevel] || 'R$ 60';
}

function estimateWalkTime(location) {
  if (!location) return 10;
  const R = 6371000;
  const dLat = (location.lat - OFFICE_LOCATION.lat) * Math.PI / 180;
  const dLng = (location.lng - OFFICE_LOCATION.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(OFFICE_LOCATION.lat * Math.PI / 180) * Math.cos(location.lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(distance / 80);
}
