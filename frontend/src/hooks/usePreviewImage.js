import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImage = () => {
  const [imageURL, setImageURL] = useState(null);
  const showToast = useShowToast();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageURL(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      showToast("Invalid File Type", "Please select a Image file", "error");
      setImageURL(null);
    }
  };
  return { handleImageChange, imageURL, setImageURL };
};

export default usePreviewImage;
