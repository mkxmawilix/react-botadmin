import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './services/Routes/ProtectedRoute';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
    return (
        <Router>

            <AuthProvider>
                <Toaster />
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/dashboard/*"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Login />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
