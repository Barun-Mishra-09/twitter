import axios from "axios";
import { useEffect } from "react";
import { USER_API_END_POINT } from "../utils/Constant";
import { getMyProfile } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const useGetProfile = (id) => {
  const dispatach = useDispatch();
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/profile/${id}`, {
          withCredentials: true,
        });
        dispatach(getMyProfile(res.data.user));
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyProfile();
  }, [id, dispatach]);
};
export default useGetProfile;
