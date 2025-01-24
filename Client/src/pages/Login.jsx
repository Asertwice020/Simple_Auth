import { useActionState } from "react"
import { Link } from "react-router";

const Login = () => {
  const [state, submitAction, isPending] = useActionState(LoginUser)

  function LoginUser (prevState, formData) {
    const formValues = Object.fromEntries(formData);
    console.log(`formValues`, formValues)
  }

  return (
    <form action={submitAction}>
      <h1>Login</h1>
      <input type="email" name="email" placeholder="email" />
      <input type="password" name="password" placeholder="password" />
      <button type="submit" disabled={isPending}>Login</button>
      <Link to="/signup">Signup</Link>
    </form>
  )
}

export default Login
