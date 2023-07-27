import axios from "axios";
import { ChangeEvent } from "react";

function App() {
  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("video")) {
      alert("Invalid file type");
      return;
    }

    try {
      const { data } = await axios.get<{ uploadUrl: string; videoId: string }>(
        "http://localhost:3000/api/signed-url",
        {
          params: {
            fileName: encodeURIComponent(file.name),
            fileType: encodeURIComponent(file.type),
          },
        }
      );
      await axios.put(data.uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
    } catch (err) {
      alert("Failed to upload video");
    }
  };

  return (
    <main>
      <input type="file" accept="video/*" id="file" onChange={uploadFile} />
    </main>
  );
}

export default App;
