"use client";

import { useState } from "react";

export default function TestDatabase() {
  const [results, setResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const testResults: any = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    // Test 1: Check if API is reachable
    try {
      testResults.tests.push({
        name: "API Reachable",
        status: "testing",
        message: "Checking if /api/content is accessible..."
      });

      const response = await fetch('/api/content?page=home');
      const data = await response.json();

      testResults.tests[0].status = response.ok ? "success" : "error";
      testResults.tests[0].message = response.ok
        ? "✅ API is reachable and responding"
        : `❌ API returned error: ${response.status}`;
      testResults.tests[0].data = data;
    } catch (error: any) {
      testResults.tests[0].status = "error";
      testResults.tests[0].message = `❌ Cannot reach API: ${error.message}`;
    }

    // Test 2: Try to save test content
    try {
      testResults.tests.push({
        name: "Database Write Test",
        status: "testing",
        message: "Attempting to save test content..."
      });

      const saveResponse = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'home',
          section: 'about',
          data: {
            title: 'TEST - Database Connection Working',
            description: 'This is a test to verify database writes are working.',
            stat1Value: '15+',
            stat1Label: 'Years of Mastery',
            stat2Value: '24k',
            stat2Label: 'Clients Styled',
            buttonText: 'Our Story',
            buttonLink: '/team'
          }
        }),
      });

      const saveData = await saveResponse.json();

      testResults.tests[1].status = saveResponse.ok ? "success" : "error";
      testResults.tests[1].httpStatus = saveResponse.status;
      testResults.tests[1].response = saveData;

      if (!saveResponse.ok) {
        testResults.tests[1].message = `❌ Save failed: ${saveData.error || 'Unknown error'}`;
        testResults.tests[1].details = saveData.details;
        testResults.tests[1].errorCode = saveData.code;

        if (saveData.code === '42P01') {
          testResults.tests[1].message = "❌ Table 'website_content' does not exist in database";
          testResults.tests[1].solution = "Run the CREATE_WEBSITE_CONTENT_TABLE_FIXED.sql script in Supabase SQL Editor";
        }
      } else {
        testResults.tests[1].message = "✅ Database write successful!";
      }
    } catch (error: any) {
      testResults.tests[1].status = "error";
      testResults.tests[1].message = `❌ Network error: ${error.message}`;
    }

    // Test 3: Verify the save by reading back
    if (testResults.tests[1].status === "success") {
      try {
        testResults.tests.push({
          name: "Database Read Test",
          status: "testing",
          message: "Verifying saved content can be read back..."
        });

        const readResponse = await fetch(`/api/content?page=home&t=${Date.now()}`);
        const readData = await readResponse.json();

        const savedTitle = readData.about?.title;
        const isTestData = savedTitle === 'TEST - Database Connection Working';

        testResults.tests[2].status = isTestData ? "success" : "warning";
        testResults.tests[2].message = isTestData
          ? "✅ Content saved and retrieved successfully!"
          : "⚠️ Content was saved but couldn't verify it was read back correctly";
        testResults.tests[2].retrievedData = readData.about;
      } catch (error: any) {
        testResults.tests[2].status = "error";
        testResults.tests[2].message = `❌ Read error: ${error.message}`;
      }
    }

    setResults(testResults);
    setTesting(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Connection Test</h1>
        <p className="text-gray-600">Run diagnostics to check if content management is working</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <button
          onClick={runTests}
          disabled={testing}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {testing ? '🔄 Running Tests...' : '🧪 Run Database Tests'}
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="text-sm text-gray-600">Test run at: {new Date(results.timestamp).toLocaleString()}</p>
          </div>

          {results.tests.map((test: any, idx: number) => (
            <div
              key={idx}
              className={`rounded-lg p-6 border-2 ${
                test.status === 'success' ? 'bg-green-50 border-green-500' :
                test.status === 'error' ? 'bg-red-50 border-red-500' :
                test.status === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                'bg-gray-50 border-gray-300'
              }`}
            >
              <h3 className="text-lg font-bold mb-2">
                {test.status === 'success' ? '✅' : test.status === 'error' ? '❌' : '⚠️'}
                {' '}{test.name}
              </h3>
              <p className="mb-4 font-medium">{test.message}</p>

              {test.details && (
                <div className="mt-4 p-3 bg-white rounded border">
                  <p className="text-sm font-semibold mb-1">Error Details:</p>
                  <p className="text-sm text-red-700">{test.details}</p>
                </div>
              )}

              {test.errorCode && (
                <div className="mt-2 p-3 bg-white rounded border">
                  <p className="text-sm font-semibold mb-1">Error Code:</p>
                  <p className="text-sm font-mono">{test.errorCode}</p>
                </div>
              )}

              {test.solution && (
                <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-300">
                  <p className="text-sm font-semibold mb-2">💡 Solution:</p>
                  <p className="text-sm text-blue-900">{test.solution}</p>
                </div>
              )}

              {test.response && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900">
                    Show Technical Details
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(test.response, null, 2)}
                  </pre>
                </details>
              )}

              {test.data && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900">
                    Show Response Data
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(test.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}

          {results.tests.every((t: any) => t.status === 'success') && (
            <div className="bg-green-100 border-2 border-green-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-900 mb-2">🎉 All Tests Passed!</h3>
              <p className="text-green-800">Your database connection is working perfectly. You can now use the Content Management page to edit your website.</p>
              <a href="/admin/content" className="inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                Go to Content Manager →
              </a>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-300">
        <h4 className="font-bold text-amber-900 mb-3">📋 Setup Checklist</h4>
        <ol className="list-decimal list-inside text-sm text-amber-800 space-y-2">
          <li>Go to Supabase Dashboard → SQL Editor</li>
          <li>Create new query</li>
          <li>Copy contents of <code className="bg-amber-100 px-1 py-0.5 rounded">CREATE_WEBSITE_CONTENT_TABLE_FIXED.sql</code></li>
          <li>Run the query</li>
          <li>Come back here and click "Run Database Tests"</li>
        </ol>
      </div>
    </div>
  );
}
