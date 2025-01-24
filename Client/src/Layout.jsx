import { Suspense } from "react"
import { Outlet } from "react-router"

const Layout = () => {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Outlet />
    </Suspense>
  )
}

export default Layout
