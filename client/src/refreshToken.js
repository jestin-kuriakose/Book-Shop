import axios from "axios";

const refreshToken = async (refreshToken) => {

    try {
      const res = await axios.post("http://localhost:8800/refresh", { token: refreshToken });
      localStorage.setItem("accessToken", res.data.accessToken)
      localStorage.setItem("refreshToken", res.data.refreshToken)
      console.log(res.data)
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  export default refreshToken
