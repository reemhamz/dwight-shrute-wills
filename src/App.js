import { useState, useEffect } from "react";
import "./styles/App.scss";
import firebase from "firebase/app";
import "firebase/database";
import dwight from "./assets/dwight.jpg";
import Modal from "./components/Modal";
import script from "./assets/ScottsTots.pdf";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZ9vDCkCJRtS9NSvh3HtuGs_NLliUO1L0",
  authDomain: "epilogue-wills.firebaseapp.com",
  projectId: "epilogue-wills",
  storageBucket: "epilogue-wills.appspot.com",
  messagingSenderId: "372547220764",
  appId: "1:372547220764:web:ded13f8b7b20696d4df6d9",
};

// Initializing firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const timeNow = new Date().toString();
const dbRef = firebase.database().ref();

function App() {
  const [wills, setWills] = useState([]);
  const [fileName, setFileName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");

  useEffect(() => {
    dbRef.on("value", (response) => {
      const fileData = response.val();
      const dataArray = [];
      for (let key in fileData) {
        dataArray.push({ key: key, info: fileData[key] });
      }
      setWills(dataArray);
    });
  }, []);

  // event listener functions
  const fileChange = (e) => {
    const uploadedInfo = [...e.target.files];
    uploadedInfo.map((e) => {
      return setFileName(e.name);
    });
  };

  // uploads the file to database
  const uploadWill = (e) => {
    e.preventDefault();
    dbRef.push({
      fileName: fileName,
      date: timeNow,
    });
  };

  // deletes file off the page and off the database
  const deleteWill = (willId) => {
    alert(
      "Are you sure you want to delete this file? It will be moved to the trash for 30 days."
    );
    dbRef.child(willId).remove();
  };

  // opens up modal
  const openModal = (willId) => {
    setShowModal(true);
    setSelectedFile(willId);
  };

  return (
    <div className="App">
      <header>
        <h1>
          Welcome to Epilogue Wills{" "}
          <span role="img" aria-label="skull">
            💀
          </span>
          <span role="img" aria-label="paper scroll">
            📜
          </span>
        </h1>
        <h2>
          Upload your signed PDF documents{" "}
          <span role="img" aria-label="ink pen">
            🖋
          </span>
        </h2>
      </header>
      <div className="form">
        <form action="#">
          <input
            type="file"
            name="fileUpload"
            accept=".pdf"
            multiple="multiple"
            onChange={fileChange}
          />
          <button type="submit" onClick={uploadWill}>
            Upload
          </button>
        </form>
      </div>

      <div className="gallery">
        <ul>
          {showModal === false &&
            wills.length > 0 &&
            wills.map(
              (will, index) =>
                will && (
                  <li key={index}>
                    <img
                      src={dwight}
                      alt="Dwight Shrute from The Office holding his bobble head"
                    />
                    <span
                      className="delete"
                      aria-label="x-button"
                      role="img"
                      onClick={() => deleteWill(will.key)}
                    >
                      ❌
                    </span>
                    <span
                      aria-label="more info"
                      className="info"
                      role="img"
                      onClick={() => openModal(will.key)}
                    >
                      ℹ️
                    </span>
                    <span aria-label="download" role="img" className="download">
                      <a href={script} download>
                        ⤵️
                      </a>
                    </span>
                    <span className="fileName">{will.info.fileName}</span>
                  </li>
                )
            )}
        </ul>
        {showModal && (
          <Modal
            willInfo={wills}
            willId={selectedFile}
            onChange={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
