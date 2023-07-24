import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState();
  const [fruitName, setFruitName] = useState("");
  const [fruitImage, setFruitImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [containerTransition, setContainerTransition] = useState(false);

  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const getToken = async () => {
    const response = await axios.post(
      "http://cjoga.dyndns-server.com:5000/login",
      {
        email: "cjoga@example.com",
        password: "12qw12qw12qw",
      }
    );

    return response.data.access_token;
  };

  const handleFileSubmit = async () => {
    if (!selectedFile) {
      setError("No file selected");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        "http://cjoga.dyndns-server.com:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      console.log(response.data);
      setFruitName(response.data.fruit_info.nombre);
      setFruitImage(URL.createObjectURL(selectedFile));
      setContainerTransition(true);
    } catch (e) {
      setError("An error occurred while predicting the fruit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 drop-shadow-lg">
        Fruit Detector
      </h1>
      <div
        className={`bg-white bg-opacity-25 rounded-lg p-5 flex flex-col items-center shadow-2xl transition-all duration-500 ease-in-out ${
          containerTransition ? " scale-101" : ""
        }`}
        onAnimationEnd={() => setContainerTransition(false)}
      >
        <input
          type="file"
          onChange={handleFileUpload}
          className="mb-4 bg-white text-black p-1 rounded"
        />
        <button
          onClick={handleFileSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition transform hover:-translate-y-0.5 hover:scale-102 duration-300 ease-in-out"
        >
          Upload
        </button>
        {isLoading && <div className="mt-5">Loading...</div>}
        {error && <div className="mt-5 text-red-500">{error}</div>}
        {fruitName && (
          <div className="mt-5 flex flex-col items-center transition-all duration-500 ease-in-out transform scale-100">
            <h2 className="text-2xl font-bold mt-5 drop-shadow-lg">
              Predicted Fruit: {fruitName}
            </h2>
            <div className="mt-4 rounded-lg overflow-hidden shadow-2xl">
              <img
                src={fruitImage}
                alt="Uploaded fruit"
                className="object-cover w-[400px] h-[400px] transition-all duration-500 ease-in-out transform hover:scale-110"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
