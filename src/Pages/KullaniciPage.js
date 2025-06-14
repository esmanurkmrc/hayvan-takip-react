import React, { useRef, useState, useEffect } from "react";
import "./KullaniciPage.css";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

const KullaniciPage = () => {
  const galleryRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const images = ["/1.jpg", "/11.jpg", "/hayvancilik2.jpg","/7.jpg","/koyun.jpg","/2.webp"];

  const scrollGallery = (direction) => {
    const scrollAmount = 600;
    if (galleryRef.current) {
      galleryRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fullscreen-gallery">
      <h2 className="gallery-title">Hayvan Takip Galerisi</h2>

      <div className="gallery-wrapper">
        <button className="scroll-btn left" onClick={() => scrollGallery("left")}>
          <FaArrowLeft />
        </button>

        <div className="image-gallery" ref={galleryRef}>
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`galeri-${index}`}
              onClick={() => setSelectedImage(src)}
            />
          ))}
        </div>

        <button className="scroll-btn right" onClick={() => scrollGallery("right")}>
          <FaArrowRight />
        </button>
      </div>

      
      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="fullscreen" className="modal-image" />
          <button className="close-modal" onClick={() => setSelectedImage(null)}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default KullaniciPage;
