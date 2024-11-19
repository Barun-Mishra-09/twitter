import axios from "axios";
import { useEffect } from "react";
import { USER_API_END_POINT } from "../utils/Constant";
import { getOtherUsers } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const useOtherUsers = (id) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/otheruser/${id}`, {
          withCredentials: true,
        });
        console.log(res);
        dispatch(getOtherUsers(res.data.otherUsers));
      } catch (error) {
        console.log(error);
      }
    };

    fetchOtherUsers();
  }, [id, dispatch]);
};

export default useOtherUsers;
