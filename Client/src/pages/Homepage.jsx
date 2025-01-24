import { logout } from "../redux/auth.api"

const Homepage = () => {
  const handleLogout = () => {
    console.log(`you clicked logout`)
    logout()
  }
  return (
    <div>
      <h1>Homepage</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Homepage
