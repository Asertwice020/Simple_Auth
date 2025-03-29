import { useNavigate } from 'react-router'
import { authService } from '../../redux/auth/api.auth'

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log(`you clicked logout`)
    const response = await authService.logout()

    alert(response.data.message)

    if (response?.data?.success) {
      navigate('/signin')
    }
  }
  return (
    <div>
      <h1>Homepage</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home
