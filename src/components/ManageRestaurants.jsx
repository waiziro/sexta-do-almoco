import { useState, useEffect } from 'react';
import { api } from '../api';

const DEFAULT_PHOTOS = [
  { label: 'Japonesa', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop' },
  { label: 'Italiana', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop' },
  { label: 'Brasileira', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
  { label: 'Carnes', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
  { label: 'Asiatica', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop' },
  { label: 'Francesa', url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop' },
  { label: 'Pizza', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
  { label: 'Sushi', url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop' },
];

const EMPTY_FORM = {
  name: '', cuisine: '', rating: '4.6', review_count: '200',
  avg_price: '', walk_time: '10', address: '', photo_url: ''
};

export default function ManageRestaurants({ onBack }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  function notify(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  useEffect(() => {
    api.get('/api/restaurants')
      .then(setRestaurants)
      .finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
  }

  function startEdit(r) {
    setForm({
      name: r.name || '',
      cuisine: r.cuisine || '',
      rating: String(r.rating || '4.5'),
      review_count: String(r.review_count || '100'),
      avg_price: r.avg_price || '',
      walk_time: String(r.walk_time || '10'),
      address: r.address || '',
      photo_url: r.photo_url || ''
    });
    setEditId(r.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    const data = {
      ...form,
      rating: parseFloat(form.rating) || 4.5,
      review_count: parseInt(form.review_count) || 100,
      price_level: form.avg_price ? Math.ceil(parseInt(form.avg_price.replace(/\D/g, '')) / 30) : 2,
      walk_time: parseInt(form.walk_time) || 10
    };

    try {
      if (editId) {
        await api.put(`/api/restaurants/${editId}`, data);
        notify('Restaurant updated!');
      } else {
        await api.post('/api/restaurants', data);
        notify('Restaurant added!');
      }
      const updated = await api.get('/api/restaurants');
      setRestaurants(updated);
      resetForm();
    } catch (err) {
      notify(err.message);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Remove "${name}" from the list?`)) return;
    try {
      await api.delete(`/api/restaurants/${id}`);
      setRestaurants(prev => prev.filter(r => r.id !== id));
      notify('Restaurant removed');
    } catch (err) {
      notify(err.message);
    }
  }

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return (
      <div className="page page-wide">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="page page-wide">
      <div className="manage-header">
        <button className="back-link" onClick={onBack}>Back to home</button>
        <h2>Manage Restaurants</h2>
        <p className="manage-subtitle">{restaurants.length} places in your list</p>
      </div>

      {!showForm && (
        <button className="btn-primary" style={{ marginBottom: 24 }} onClick={() => setShowForm(true)}>
          + Add Restaurant
        </button>
      )}

      {showForm && (
        <div className="manage-form">
          <h3>{editId ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>

          <div className="form-row">
            <input placeholder="Restaurant name *" value={form.name} onChange={e => setField('name', e.target.value)} />
          </div>
          <div className="form-row">
            <input placeholder="Cuisine (e.g. Japonesa)" value={form.cuisine} onChange={e => setField('cuisine', e.target.value)} />
            <input placeholder="Avg price (e.g. R$ 75)" value={form.avg_price} onChange={e => setField('avg_price', e.target.value)} />
          </div>
          <div className="form-row">
            <input type="number" step="0.1" min="1" max="5" placeholder="Rating" value={form.rating} onChange={e => setField('rating', e.target.value)} />
            <input type="number" min="0" placeholder="Reviews" value={form.review_count} onChange={e => setField('review_count', e.target.value)} />
            <input type="number" min="1" max="30" placeholder="Walk min" value={form.walk_time} onChange={e => setField('walk_time', e.target.value)} />
          </div>
          <div className="form-row">
            <input placeholder="Address" value={form.address} onChange={e => setField('address', e.target.value)} />
          </div>
          <div className="form-row">
            <input placeholder="Photo URL (or pick below)" value={form.photo_url} onChange={e => setField('photo_url', e.target.value)} />
          </div>

          <div className="photo-picker">
            {DEFAULT_PHOTOS.map(p => (
              <button
                key={p.label}
                className={`photo-option ${form.photo_url === p.url ? 'selected' : ''}`}
                onClick={() => setField('photo_url', p.url)}
                title={p.label}
              >
                <img src={p.url} alt={p.label} />
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {form.photo_url && (
            <div className="photo-preview">
              <img src={form.photo_url} alt="Preview" onError={e => { e.target.style.display = 'none'; }} />
            </div>
          )}

          <div className="form-actions">
            <button className="btn-primary" onClick={handleSave} disabled={!form.name.trim()}>
              {editId ? 'Save Changes' : 'Add Restaurant'}
            </button>
            <button className="btn-cancel" onClick={resetForm}>Cancel</button>
          </div>
        </div>
      )}

      <div className="manage-list">
        {restaurants.map(r => (
          <div key={r.id} className="manage-item">
            {r.photo_url && (
              <img className="manage-item-photo" src={r.photo_url} alt={r.name} onError={e => { e.target.style.display = 'none'; }} />
            )}
            <div className="manage-item-info">
              <div className="manage-item-name">{r.name}</div>
              <div className="manage-item-meta">
                <span className="star">★</span> {r.rating}
                {r.cuisine ? ` · ${r.cuisine}` : ''}
                {r.avg_price ? ` · ${r.avg_price}/person` : ''}
                {r.walk_time ? ` · 🚶 ${r.walk_time} min` : ''}
              </div>
              {r.address && <div className="manage-item-address">{r.address}</div>}
            </div>
            <div className="manage-item-actions">
              <button className="btn-edit" onClick={() => startEdit(r)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(r.id, r.name)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
