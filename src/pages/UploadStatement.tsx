// src/pages/UploadStatement.tsx

import React, { useState } from "react";
import { uploadStatement, getTransactions } from "../services/api";

type UploadStatementProps = {
  onDone?: (transactions: any) => void;
};

const UploadStatement: React.FC<UploadStatementProps> = ({ onDone }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem("userId") || "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !userId) {
      setError("Please select a CSV file and ensure you are logged in.");
      return;
    }
    setUploading(true);
    setResult(null);
    setError(null);
    try {
      const res = await uploadStatement(file, userId);
      setResult(res.insertedCount ? `Inserted ${res.insertedCount} transactions.` : res.message || "Upload successful.");
      const transactions = await getTransactions(userId);
      if (onDone) onDone(transactions);
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Bank Statement (.csv)</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 disabled:opacity-50"
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {result && <div className="text-green-600 mt-2">{result}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default UploadStatement;