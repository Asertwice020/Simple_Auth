import { useActionState } from "react"
import { Link } from "react-router";
import { signup } from "../redux/auth.api";

const Signup = () => {
  const [state, submitAction, isPending] = useActionState(registerUser)

  async function registerUser(prevState, formData) {
    try {
      // Get individual form values using formData.get()
      const userData = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password")
      };
      
      const response = await signup(userData);
      return { success: true, message: "Registration successful!", data: response };
    } catch (error) {
      return { error: error.message || "Registration failed" };
    }
  }

  return (
    <form action={submitAction}>
      <h1>Signup</h1>
      <input type="text" name="username" placeholder="username" />
      <input type="email" name="email" placeholder="email" />
      <input type="password" name="password" placeholder="password" />
      <button type="submit" disabled={isPending}>Signup</button>
      <Link to="/login">Login</Link>
    </form>
  )
}

export default Signup
