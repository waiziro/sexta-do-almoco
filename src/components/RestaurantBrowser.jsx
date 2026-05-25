import { useState, useEffect } from 'react';
import { api } from '../api';
import RestaurantCard from './RestaurantCard';

export default function RestaurantBrowser({ onNominate, nominatedIds }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/api/restaurants')
      .then(setRestaurants)
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, []);

  const cuisines = [...new Set(restaurants.map(r => r.cuisine).filter(Boolean))];

  const filtered = filter === 'all'
    ? restaurants
    : restaurants.filter(r => r.cuisine === filter);

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>;
  }

  return (
    <div>
      {cuisines.length > 1 && (
        <div className="participants-strip" style={{ marginBottom: 16 }}>
          <button
            className={`participant-chip ${filter === 'all' ? 'going' : ''}`}
            onClick={() => setFilter('all')}
            style={{ cursor: 'pointer', border: 'none' }}
          >
            All
          </button>
          {cuisines.map(c => (
            <button
              key={c}
              className={`participant-chip ${filter === c ? 'going' : ''}`}
              onClick={() => setFilter(c)}
              style={{ cursor: 'pointer', border: 'none' }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="restaurant-grid">
        {filtered.map(r => (
          <RestaurantCard
            key={r.id || r.place_id}
            restaurant={r}
            onNominate={onNominate}
            isNominated={nominatedIds.includes(r.id) || nominatedIds.includes(r.place_id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <p>No restaurants found for this filter.</p>
        </div>
      )}
    </div>
  );
}
