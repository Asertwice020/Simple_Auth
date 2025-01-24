import { API } from "../config/api.config"

const signup = async (formData) => {
  try {
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    }
    const response = await API.post("/auth/signup", formData, options)

    console.log(`response`, response)
  } catch (error) {
    console.log(error)
  }
}

const logout = async () => {
  try {
    const options = {
      withCredentials: true
    }
    const response = await API.get("/auth/logout", options)

    console.log(`response`, response)
  } catch (error) {
    console.log(error)
  }
}

export { signup, logout }