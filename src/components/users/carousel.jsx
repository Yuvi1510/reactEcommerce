import { useState, useEffect, use } from "react";
import baseApi from "../../js/BaseApi";
import BASE_API from "../../js/Constants";

export default function Carousel(){
  

   const [images, setImages] = useState([]);

  const fetchData = async () => {
    try {
      const res = await baseApi.get("/carousel");
      setImages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

    const infiniteSlides = [...images, ...images, ...images];
    const [currentSlide, setCurrentSlide] = useState(images.length);
    const [isAnimating, setIsAnimating] = useState(false);


    const nextSlide = () => {
      if(isAnimating) return;
      setIsAnimating(true);
      setCurrentSlide((prev) => prev + 1);
    }
    
    const previousSlide = () =>{
      if(isAnimating) return;
      setIsAnimating(true);
      setCurrentSlide((prev) => prev - 1);
    }

    useEffect(() => {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);

      return () => clearInterval(interval);
    }, [])

    useEffect(()=>{
      if(currentSlide >= images.length * 2){
         setTimeout(() => {
                setCurrentSlide(images.length);
                setIsAnimating(false);
            }, 500);
      }else if (currentSlide < images.length) {
            setTimeout(() => {
                setCurrentSlide(images.length * 2 - 1);
                setIsAnimating(false);
            }, 500);
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 500);
            return () => clearTimeout(timer);
        }
    },[currentSlide, images.length]);

    
    return (
      <div className="relative overflow-hidden group">

        <div className={` flex min-w-full h-[500px] transition-transform duration-500 ease-in-out `}
        style={{ 
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: isAnimating ? "transform 500ms ease-in-out" : "none" 
        }}>
          {infiniteSlides.map((slide, index) => {
            return (
              <div key={`${index}-img`} className="relative min-w-full">
                <img className="min-w-full h-full object-cover object-center" src={`${BASE_API}/images/${slide.imagePath}`} alt={slide.alt} />

                {/* Subtle gradient overlay to make text pop */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent"></div>

                <div className="z-10 absolute bottom-12 left-10 right-0 text-white p-4">
                  <h3 className="text-4xl font-bold mb-2">{slide.title}</h3>
                  <p className="text-lg text-zinc-200">{slide.subTitle}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Previous Button */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-20" 
          onClick={previousSlide}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Next Button */}
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-20" 
          onClick={nextSlide}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {images.map((_, index) => (
             <button
              key={index}
              onClick={() => {
                if(isAnimating) return;
                setIsAnimating(true);
                setCurrentSlide(images.length + index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                (currentSlide % (images.length || 1) === index) 
                  ? "bg-white scale-110 shadow-lg" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

      </div>
    );
}