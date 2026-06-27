"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminTestPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    setError("");

    try {
      // Test API endpoint
      const response = await fetch('/api/test');
      const data = await response.json();

      // Test services endpoint
      let servicesTest = 'Not tested';
      try {
        const servicesResponse = await fetch('/api/services');
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          servicesTest = `Success - ${servicesData.length || 0} services found`;
        } else {
          servicesTest = `Failed - Status ${servicesResponse.status}`;
        }
      } catch (err: any) {
        servicesTest = `Error: ${err.message}`;
      }

      setDiagnostics({
        ...data,
        servicesEndpoint: servicesTest,
        clientEnv: {
          NEXT_PUBLIC_SUPABASE_URL: typeof window !== 'undefined' ?
            (process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not available') : 'Server side',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: typeof window !== 'undefined' ?
            (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not available') : 'Server side',
        }
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Diagnostics</h1>

          <div className="mb-6">
            <button
              onClick={runDiagnostics}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Run Diagnostics Again
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Running diagnostics...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-red-800 font-semibold mb-2">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!loading && diagnostics && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Environment Variables (Server)</h2>
                <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
                  {JSON.stringify(diagnostics.environment, null, 2)}
                </pre>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Environment Variables (Client)</h2>
                <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
                  {JSON.stringify(diagnostics.clientEnv, null, 2)}
                </pre>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Supabase Connection</h2>
                <p className={`text-lg font-semibold ${
                  diagnostics.supabase.includes('success') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {diagnostics.supabase}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Services Endpoint</h2>
                <p className={`text-lg font-semibold ${
                  diagnostics.servicesEndpoint.includes('Success') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {diagnostics.servicesEndpoint}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-blue-900 font-bold mb-3">What to do if there are errors:</h3>
                <ul className="list-disc list-inside space-y-2 text-blue-800">
                  <li>If environment variables show "Missing" - Add them in Render Dashboard</li>
                  <li>If Supabase connection fails - Check DATABASE_URL and Supabase credentials</li>
                  <li>If Services endpoint fails - Check the error message for details</li>
                </ul>
              </div>

              <div className="mt-8 flex gap-4">
                <Link href="/admin/services">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                    Go to Services Admin
                  </button>
                </Link>
                <Link href="/admin">
                  <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                    Back to Admin
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
