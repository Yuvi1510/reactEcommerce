import { useState } from "react";
import baseApi from "../../js/BaseApi";

export default function CarouselForm({ refresh }) {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    alert("Uploading...");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("file", file);

    try {
      await baseApi.post("/carousel/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Uploaded successfully");

      setTitle("");
      setSubTitle("");
      setFile(null);
      refresh(); // refresh list

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col  items-center p-4 border rounded mb-4">
      <h2 className="text-lg font-bold mb-2">Upload Carousel</h2>

      <input
        className="border rounded-2xl  p-2 w-[500px] mb-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border  rounded-2xl p-2 w-[500px] mb-2"
        placeholder="Subtitle"
        value={subTitle}
        onChange={(e) => setSubTitle(e.target.value)}
      />

      <input
        type="file"
        className="mb-2 border-1 rounded-2xl p-2 w-[500px]"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button type="submit" className="rounded-2xl hover:cursor-pointer bg-emerald-500 text-white px-4 py-2">
        Upload
      </button>
    </form>
  );
}