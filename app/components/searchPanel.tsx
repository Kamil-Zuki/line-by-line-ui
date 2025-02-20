"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface UseCase {
  content: string;
  definition: { content: string }[];
}

interface DictionaryResult {
  word: string;
  partOfspeech: string;
  uk: { transcription: string; audio: string };
  us: { transcription: string; audio: string };
  useCases: UseCase[];
}

export default function SearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DictionaryResult[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsModalOpen(false);
      else if (event.key === "Enter" && query.trim()) handleSearch();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [query]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://85.175.218.17/api/v1/cambridge-dictionary?term=${query}&isWord=true&isPhrasalVerb=true&isIdiom=true`
      );
      setResults(response.data.termData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setResults([]);
  };

  const CustomAudioPlayer = ({
    src,
    label,
    id,
  }: {
    src: string;
    label: string;
    id: string;
  }) => {
    const handlePlay = () => {
      const audio = new Audio(src);
      audio.play();
      setAudioPlaying(id);
      audio.onended = () => setAudioPlaying(null);
    };

    return (
      <div className="flex flex-col items-center mt-6 space-y-2">
        <span className="text-lg font-medium">{label}:</span>
        <button
          onClick={handlePlay}
          className={`w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700  shadow-lg transition-all duration-200 ${
            audioPlaying === id ? "scale-110" : "scale-100"
          }`}
        >
          {audioPlaying === id ? "♪" : "▶"}
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex w-full max-w-[800px] justify-center">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-3/4 h-10 p-3 rounded-xl bg-gray-600 text-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-md"
        />
        <button
          onClick={handleSearch}
          className="h-10 bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700 font-semibold transition-all shadow-lg"
        >
          Search
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black text-white p-8 rounded-xl w-[90%] max-w-3xl max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all scale-105 animate-modal-open">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <div className="flex-1/2"></div>
              <h2 className="text-2xl font-semibold text-white">
                Search Results
              </h2>
              <button
                onClick={closeModal}
                className="bg-transparent text-white p-2 rounded-full hover:text-blue-500 focus:outline-none transition"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto space-y-8">
              {results.map((result, index) => (
                <div key={index} className="mb-8 border-b pb-4">
                  <div className="text-center">
                    <h3 className="text-3xl font-semibold">{result.word}</h3>
                    <p className="text-xl font-medium text-blue-600 mt-2">
                      {result.partOfspeech}
                    </p>
                  </div>

                  <div className="mt-6 space-y-6">
                    <div className="text-center">
                      <span className="text-lg font-medium">
                        UK Transcription:
                      </span>
                      <p className="text-lg ">{result.uk.transcription}</p>
                      {result.uk.audio && (
                        <CustomAudioPlayer
                          src={result.uk.audio}
                          label="UK Audio"
                          id={`uk-${index}`}
                        />
                      )}
                    </div>
                    <div className="text-center">
                      <span className="text-lg font-medium ">
                        US Transcription:
                      </span>
                      <p className="text-lg ">{result.us.transcription}</p>
                      {result.us.audio && (
                        <CustomAudioPlayer
                          src={result.us.audio}
                          label="US Audio"
                          id={`us-${index}`}
                        />
                      )}
                    </div>

                    {result.useCases.map((useCase, i) => (
                      <div
                        key={i}
                        className="bg-gray-800 p-6 rounded-lg shadow-lg"
                      >
                        <h4 className="text-xl font-medium  text-center">
                          {useCase.content}
                        </h4>
                        <div className="mt-4 space-y-2">
                          {useCase.definition.map((def, j) => (
                            <p key={j} className="text-lg ">
                              {def.content}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
