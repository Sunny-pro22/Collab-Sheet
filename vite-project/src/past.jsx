import axios from 'axios';
import { useEffect, useState } from 'react';
import './Past.css'; 
import img1 from './pic/1.png';
import gsap from "gsap";
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

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const res = await axios.post('http://localhost:1313/crtdSheet', { email: userEmail }, config);
        if (res.data.success) {
          setUids(res.data.uids);
        } else {
          setError('Failed to fetch UIDs');
        }
      } catch (error) {
        setError('Error fetching UIDs');
      } finally {
        setLoading(false);
      }
    };

    fetchUids();
  }, []);
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
        {uids.length === 0 ? (
          <div className="no-sheets"></div>
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
