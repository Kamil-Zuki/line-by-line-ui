export default function AuthPage() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-md rounded-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Authentication</h2>
          <form>
            <input type="email" placeholder="Email" className="w-full mb-4 p-2 border border-gray-300 rounded" />
            <input type="password" placeholder="Password" className="w-full mb-4 p-2 border border-gray-300 rounded" />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
          </form>
        </div>
      </div>
    );
  }
  