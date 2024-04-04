import axios from "axios";
import { useState } from "react";
import useShowToast from "./useShowToast";

const useGetFileName = () => {
  const [fileName, setFileName] = useState(null);
  const useToast = useShowToast();

  const getFileName = async (selectedTeamId) => {
    try {
      const res = await axios.get(`/api/userData/fileName/${selectedTeamId}`, {
        params: {
          fileId: selectedTeamId,
        },
      });

      setFileName(res.data);
    } catch (error) {
      useToast("Error", error.response.data.message, "error");
    }
  };
  return { getFileName, fileName };
};

export default useGetFileName;
