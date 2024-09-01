import { useEffect, useState } from "react";
import axios from "axios";
import "./m.css";
import Sheet from "./spd"; 
import { useNavigate } from 'react-router-dom';
export default function Croom({ onClose }) {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [wait, setWait] = useState(false);
  const [error, setError] = useState("");
  const [user,setUser]=useState("");
  useEffect(()=>{
    setUser(localStorage.getItem("email"))
  },[])
  const createRoom = async () => {
  
    if (!id.trim()) {
      setError("Please enter a valid ID.");
      return;
    }

    setError("");
    setWait(true);
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };
    try {
      const res = await axios.post("https://collab-sheet-5.onrender.com/spd", { id,user}, config);
      console.log(res.data);
      if(res.data=="Access denied"){
        setError("Access denied");
        setId("");
      }
      else if (res.data !== "OK") {
        setError("No such sheet present.");
        setId("");
      } else {
        navigate(`/data/${id}`)
      }
    } catch (error) {
      setError("Error creating room. Please try again.");
      console.error("Error creating room:", error);
    } finally {
      setWait(false);
    }
  };

  const handleCloseSheet = () => {
    setShowSheet(false);
    onClose();
  };

  return (
    <>
      {wait ? (
        <div className="modal">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <div className="modal">
          <button className="close-button" onClick={onClose}>×</button>
          <h3 className="etrid">Enter Sheet ID</h3>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter ID..."
            className={`input-field ${error ? 'input-error' : ''}`}
          />
          {error && <div className="error-message">{error}</div>}
          <button className="rsub" onClick={createRoom}>
            Enter
          </button>
          
        </div>
      )}
    </>
  );
}
