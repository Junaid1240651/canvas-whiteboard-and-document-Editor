import { useState } from "react";

const useLoading = () => {
  const [isLoading, setLoading] = useState(false);
  return { isLoading, setLoading };
};

export default useLoading;
