export default function RestaurantCard({ restaurant, onNominate, isNominated }) {
  return (
    <div className="restaurant-card">
      {restaurant.photo_url && (
        <img
          className="card-photo"
          src={restaurant.photo_url}
          alt={restaurant.name}
          loading="lazy"
          onError={e => { e.target.style.display = 'none'; }}
        />
      )}
      <div className="card-body">
        <div className="card-header">
          <div className="card-name">{restaurant.name}</div>
          {restaurant.walk_time ? (
            <div className="card-walk">🚶 {restaurant.walk_time} min</div>
          ) : null}
        </div>
        <div className="card-meta">
          <span className="card-rating">
            <span className="star">★</span> {restaurant.rating}
          </span>
          <span>({restaurant.review_count} reviews)</span>
          {restaurant.cuisine && <span className="card-cuisine">{restaurant.cuisine}</span>}
        </div>
        {restaurant.address && (
          <div className="card-address">{restaurant.address}</div>
        )}
        <div className="card-footer">
          {restaurant.avg_price ? (
            <div className="card-price">{restaurant.avg_price}/person</div>
          ) : (
            <div className="card-price"></div>
          )}
          {onNominate && (
            <button
              className={`btn-nominate ${isNominated ? 'nominated' : ''}`}
              onClick={() => !isNominated && onNominate(restaurant)}
              disabled={isNominated}
            >
              {isNominated ? '✓ Nominated' : 'Nominate'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
