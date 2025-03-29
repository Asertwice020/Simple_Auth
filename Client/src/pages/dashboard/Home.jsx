import { useNavigate } from 'react-router'
import { useState } from 'react'
import { authService } from '../../redux/auth/api.auth'
import Modal from '../../components/ui/Modal'

const Home = () => {
  const navigate = useNavigate()
  const [state, setState] = useState({
    activeModal: null,
    confirmText: '',
    password: '',
    isLoading: false
  })

  const handleLogout = async () => {
    const response = await authService.logout()
    alert(response.data.message)
    if (response?.data?.success) navigate('/signin')
  }

  const handleAccountAction = async (e, actionType) => {
    e.preventDefault()
    const { confirmText, password } = state
    
    const actions = {
      deactivate: {
        service: authService.deactivateAccount,
        requiredText: 'DEACTIVATE MY ACCOUNT',
        successRedirect: true
      },
      delete: {
        service: authService.removeAccount,
        requiredText: 'DELETE MY ACCOUNT',
        successRedirect: true
      }
    }

    const { service, requiredText, successRedirect } = actions[actionType]

    if (confirmText !== requiredText) {
      alert(`Please type '${requiredText}' to confirm`)
      return
    }

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await service({ confirmText, password })
      alert(response.data.message)
      if (successRedirect && response?.data?.success) navigate('/signin')
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${actionType} account`)
    } finally {
      setState({
        activeModal: null,
        confirmText: '',
        password: '',
        isLoading: false
      })
    }
  }

  return (
    <div>
      <h1>Homepage</h1>
      <div className="account-actions">
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => setState({ ...state, activeModal: 'deactivate' })}>
          Deactivate Account
        </button>
        <button onClick={() => setState({ ...state, activeModal: 'delete' })}>
          Delete Account
        </button>
      </div>

      <Modal
        isOpen={state.activeModal === 'deactivate'}
        onClose={() => setState({ ...state, activeModal: null })}
        title="Deactivate Account"
        message="Your account will be temporarily deactivated. You can reactivate it by logging in within 30 days."
      >
        <form onSubmit={(e) => handleAccountAction(e, 'deactivate')}>
          <div className="form-group">
            <label>Type 'DEACTIVATE MY ACCOUNT' to confirm:</label>
            <input
              type="text"
              value={state.confirmText}
              onChange={(e) => setState({ ...state, confirmText: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={state.password}
              onChange={(e) => setState({ ...state, password: e.target.value })}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setState({ ...state, activeModal: null })}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={state.isLoading || state.confirmText !== 'DEACTIVATE MY ACCOUNT'}
            >
              {state.isLoading ? 'Processing...' : 'Deactivate'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={state.activeModal === 'delete'}
        onClose={() => setState({ ...state, activeModal: null })}
        title="Delete Account Permanently"
        message="Warning: This action cannot be undone. All your data will be permanently deleted."
      >
        <form onSubmit={(e) => handleAccountAction(e, 'delete')}>
          <div className="form-group">
            <label>Type 'DELETE MY ACCOUNT' to confirm:</label>
            <input
              type="text"
              value={state.confirmText}
              onChange={(e) => setState({ ...state, confirmText: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={state.password}
              onChange={(e) => setState({ ...state, password: e.target.value })}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setState({ ...state, activeModal: null })}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={state.isLoading || state.confirmText !== 'DELETE MY ACCOUNT'}
              className="delete-btn"
            >
              {state.isLoading ? 'Processing...' : 'Delete Permanently'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Home