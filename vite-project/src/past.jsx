import axios from 'axios';
import { useEffect, useState } from 'react';
import './Past.css'; 
import img1 from './pic/1.png';
import { useNavigate } from 'react-router-dom';

export default function Past() {
  const navigate = useNavigate();
  const [uids, setUids] = useState([]);
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleSheetClick = (id) => {
    navigate(`/data/${id}`);
  };

  useEffect(() => {
    const fetchUids = async () => {
      const userEmail = localStorage.getItem('email');
      setUser(userEmail);
      console.log('Fetching UIDs for:', userEmail);

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const res = await axios.post('https://collab-sheet-5.onrender.com/crtdSheet', { email: userEmail }, config);
        
        if (res.data.success) {
          setUids(res.data.uids);
        } 
      } catch (error) {
        setError('Error fetching UIDs');
      } finally {
        setLoading(false);
      }
    };

    fetchUids();
  }, []); // Empty dependency array to run only on mount

  const handleClick = () => {
    navigate("/sheet");
  };

  return (
    <div className="past-container">
      <h1 className="past-title">Your Sheets</h1>
      <div className="past-background">
        <div className="sheet-item create-sheet-btn" onClick={handleClick} title="Create New Sheet">
          <span className="plus-sign">+</span>
        </div>
        {loading ? (
          <div className="loading-animation">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading sheets...</p>
          </div>
       
        ) : uids.length === 0 ? (
          <div className="no-sheets">No sheets available</div>
        ) : (
          uids.map((id, index) => (
            <div
              key={index}
              onClick={() => handleSheetClick(id)}
              className={`sheet-item`}
              title={`Sheet ID: ${id}`}
            >
              <img src={img1} alt={`Sheet ${index}`} className="sheet-image" />
              <p className="sheet-id">ID: {id}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}