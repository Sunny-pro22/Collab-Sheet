import React, { useRef, useEffect, useState } from 'react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import "./sheet.css";
import { useParams } from 'react-router-dom';

function Spreadsheet({ onClose }) {
  const { id } = useParams();
  const containerRef = useRef(null);
  const [hotInstance, setHotInstance] = useState(null);
  const [uuid, setUid] = useState(uuidv4());
  const [sdata, setSdata] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [accessModalVisible, setAccessModalVisible] = useState(false);
  const [accessOption, setAccessOption] = useState('personal');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (id && typeof id === 'string' && id.trim() !== "") {
        setUid(id);
        try {
          console.log(id);
          const res = await axios.post(`http://localhost:1313/data/${id}`);
          setSdata(res.data.data || []);
        } catch (error) {
          console.error("Error fetching sheet data:", error);
        }
      } else {
        console.warn("ID is not defined or empty");
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (containerRef.current) {
      const hot = new Handsontable(containerRef.current, {
        data: sdata.length ? sdata : Handsontable.helper.createSpreadsheetData(50, 50),
        colHeaders: true,
        rowHeaders: true,
        licenseKey: 'non-commercial-and-evaluation',
        stretchH: 'all',
        formulas: true, // Enable the formulas plugin
        contextMenu: true, // Optional: Enable context menu for easier interaction
        dropdownMenu: true, // Optional: Enable dropdown menu for easier interaction
      });
      setHotInstance(hot);

      return () => {
        if (hot) {
          hot.destroy();
        }
      };
    }
  }, [sdata]);

  const saveData = async ({ data, email, uuid, accessOption }) => {
    if (accessOption === "email") {
      const emailSuffix = email.split('@')[1];
      accessOption = emailSuffix;
    }

    try {
      const response = await axios.post('http://localhost:1313/save', { data, email, uuid, accessOption });
      if (response.status === 200) {
        setModalMessage('Data saved successfully!');
      } else {
        setModalMessage('Failed to save data.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setModalMessage('Error saving data.');
    } finally {
      setShowModal(true);
    }
  };

  const getAllDataAndSave = () => {
    if (hotInstance) {
      const userEmail = localStorage.getItem("email");
      if (!userEmail) {
        alert('Please log in before saving the data.');
        return;
      }

      const data = hotInstance.getData();
      saveData({ data, email: userEmail, uuid, accessOption });
    }
  };

  const copyUuidToClipboard = () => {
    navigator.clipboard.writeText(uuid)
      .then(() => alert('UUID copied to clipboard!'))
      .catch(err => {
        console.error('Could not copy text: ', err);
        alert('Failed to copy UUID.');
      });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openAccessModal = () => {
    setAccessModalVisible(true);
  };

  const closeAccessModal = () => {
    setAccessModalVisible(false);
  };

  const handleAccessOptionChange = (e) => {
    setAccessOption(e.target.value);
  };

  const handleAccessSubmit = () => {
    setAccessModalVisible(false);
    getAllDataAndSave();
  };

  return (
    <div className="spreadsheet-container">
     
      <div className="buttons-container">
        <button onClick={openAccessModal} className="action-button">Save</button>
        <div className="uuid-container">
          <p className="uuid-text">UUID: {uuid}</p>
          <button onClick={copyUuidToClipboard} className="copy-button">Copy UUID</button>
        </div>
      </div>
      <h2 className="spreadsheet-title">Spreadsheet</h2>
      
      <div ref={containerRef} className="spreadsheet-table"></div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={closeModal} className="modal-close-button">Close</button>
          </div>
        </div>
      )}

      {/* Access Control Modal */}
      {accessModalVisible && (
        <div className="modal-overlay">
          <div className="access-modal-content">
            <h3>Select Access Option</h3>
            <label>
              <input type="radio" value="everyone" checked={accessOption === 'everyone'} onChange={handleAccessOptionChange} />
              Everyone
            </label>
            <label>
              <input type="radio" value="personal" checked={accessOption === 'personal'} onChange={handleAccessOptionChange} />
              Personal
            </label>
            <label>
              <input type="radio" value="email" checked={accessOption === 'email'} onChange={handleAccessOptionChange} />
              Email Specific
            </label>
            <p className='emailinfo'>(only your organisation member can access)</p>
            <div className="access-modal-buttons">
              <button onClick={handleAccessSubmit} className="modal-close-button">OK</button>
              <button onClick={closeAccessModal} className="modal-close-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Spreadsheet;
