import { useEffect, useState } from "react";
import baseApi from "../../js/BaseApi";

export default function CarouselList({refresh, refreshFlag }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await baseApi.get("/carousel");
      setImages(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshFlag]);

  const deleteItem = (id) => async () => {
    setIsLoading(true);
    try{
      const response = baseApi.delete(`/carousel/${id}`);
      refresh();
    }catch(err){
      console.log(err);
    }finally{
      setIsLoading(false);
    }
    
  }

  return (
    <div className="grid grid-cols-5 gap-4 md:grid-cols-3 sm:grid-cols-2">
      {images.map((item) => (
        <div key={item.id} className="border p-2">
          <img
            src={`http://localhost:8082/images/${item.imagePath}`}
            alt={item.title}
            className="w-full h-[200px] object-cover"
          />
          <h3 className="font-bold">{item.title}</h3>
          <p>{item.subTitle}</p>

          <button onClick={deleteItem(item.id)} className="my-2 bg-red-500 py-1 px-4 border-2 border-pink-500 rounded-2xl text-white hover:cursor-pointer">Delete</button>
        </div>
      ))}
    </div>
  );
}