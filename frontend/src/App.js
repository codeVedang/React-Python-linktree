import React, { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://127.0.0.1:5000';

export default function App() {
  // --- SCRIPT SECTION: STATE MANAGEMENT WITH HOOKS ---
  // Here I use React's useState Hook to manage all component state.
  // This includes the auth token, the list of links, and the current page view.
  const [page, setPage] = useState('login');
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [links, setLinks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // This is a test function left over from debugging, not part of the main app logic.
  const handleTestBackend = async () => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/test`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Test failed');
      alert(`Success! Backend says: "${data.message}"`);
    } catch (err) {
      alert(`Error testing backend: ${err.message}`);
      setError(err.message);
    }
  };

  const handleAuth = async (endpoint) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Auth failed');
      if (endpoint === 'login') {
        // After login, the token is saved to Local Storage for persistence.
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
      } else {
        setPage('login');
        alert('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);

  // --- SCRIPT SECTION: FETCHING DATA & USING THE TOKEN ---
  // This useCallback hook defines the function to fetch links from the protected API.
  const fetchLinks = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      // The fetch call includes the JWT token in the Authorization header.
      // This is how the backend authenticates the request.
      const response = await fetch(`${API_URL}/api/links`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ msg: `HTTP error! status: ${response.status}` }));
        throw new Error(errData.msg);
      }
      const data = await response.json();
      setLinks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // --- SCRIPT SECTION: REACTIVE PROGRAMMING WITH USEEFFECT ---
  // This useEffect hook demonstrates reactive programming.
  // It automatically calls `fetchLinks` whenever the `token` state changes.
  useEffect(() => {
    if (token) {
      setPage('links');
      fetchLinks();
    } else {
      setPage('login');
    }
  }, [token, fetchLinks]);

  const handleAddLink = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/links`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle, url: newUrl }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ msg: `HTTP error! status: ${response.status}` }));
        throw new Error(errData.msg);
      }
      setNewTitle('');
      setNewUrl('');
      fetchLinks(); // Re-fetch links to show the new one immediately.
    } catch (err) {
      setError(err.message);
    }
  };

  const renderAuthPage = (isLogin) => (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <form onSubmit={(e) => { e.preventDefault(); handleAuth(isLogin ? 'login' : 'register'); }} className="bg-gray-800 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-white text-3xl font-bold mb-2 text-center">{isLogin ? 'Login' : 'Create Account'}</h2>
          <div className="text-center mb-6">
            <button type="button" onClick={handleTestBackend} className="text-xs text-cyan-400 hover:underline">Test Backend Connection</button>
          </div>
          {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</p>}
          <div className="mb-4"><input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-lg" required /></div>
          <div className="mb-6"><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-lg" required /></div>
          <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-500 transition-colors disabled:bg-gray-500">{isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}</button>
          <p className="text-center text-gray-400 mt-6">{isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => { setPage(isLogin ? 'register' : 'login'); setError(null); }} className="font-semibold text-purple-400 hover:text-purple-300">{isLogin ? 'Register Here' : 'Login Here'}</button>
          </p>
        </form>
      </div>
    </div>
  );

  const renderLinksPage = () => (
    <div className="bg-gray-900 min-h-screen font-sans text-white p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">My Links</h1>
          <button onClick={handleLogout} className="py-2 px-4 bg-gray-700 rounded-lg hover:bg-gray-600 font-semibold">Logout</button>
        </header>
        {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</p>}
        <form onSubmit={handleAddLink} className="bg-gray-800/50 p-6 rounded-2xl shadow-lg mb-10 border border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
                <input type="text" placeholder="Title (e.g., My Portfolio)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="flex-grow bg-gray-700 p-3 rounded-lg" required />
                <input type="url" placeholder="URL (e.g., https://...)" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="flex-grow bg-gray-700 p-3 rounded-lg" required />
                <button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 font-bold py-3 px-6 rounded-lg">Add Link</button>
            </div>
        </form>
        <div className="space-y-4">
          {isLoading && !links.length ? <p className="text-center text-gray-400">Loading...</p> : links.map((link) => (
            <div key={link.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-purple-300 flex-grow truncate pr-4">{link.title}</a>
            </div>
          ))}
           {!isLoading && !links.length && <p className="text-center text-gray-500 py-8">No links yet!</p>}
        </div>
      </div>
    </div>
  );

  if (page === 'login') return renderAuthPage(true);
  if (page === 'register') return renderAuthPage(false);
  if (page === 'links') return renderLinksPage();
  return renderAuthPage(true);
}
