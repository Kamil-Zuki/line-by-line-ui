"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface VerbForms {
  presentParticiple: string;
  pastTense: string;
  pastParticiple: string;
}

interface Definition {
  content: string;
  lvl: string;
  translate: string;
  examples: string[];
}

interface UseCase {
  content: string;
  definition: Definition[];
}

interface DictionaryResult {
  word: string;
  partOfspeech: string;
  formality: string;
  vebForms: VerbForms;
  uk: { transcription: string; audio: string };
  us: { transcription: string; audio: string };
  useCases: UseCase[];
}

interface ApiResponse {
  termData: DictionaryResult[];
  termSuggestions: string[];
}

export default function SearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DictionaryResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
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
      const response = await axios.get<ApiResponse>(
        `http://85.175.218.17/api/v1/cambridge-dictionary?term=${query}&isWord=true&isPhrasalVerb=true&isIdiom=true`
      );
      setResults(response.data.termData || []);
      setSuggestions(response.data.termSuggestions || []);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
      setSuggestions([]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setResults([]);
    setSuggestions([]);
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
          className={`w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 shadow-lg transition-all duration-200 ${
            audioPlaying === id ? "scale-110" : "scale-100"
          }`}
        >
          {audioPlaying === id ? "♪" : "▶"}
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-10 flex-col items-center justify-center w-full">
      <div className="flex w-full max-w-[800px] justify-center">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-3/4 h-8 p-2 rounded-lg bg-gray-600 text-base text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-md"
        />
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
              {results.length > 0 ? (
                results.map((result, index) => (
                  <div key={index} className="mb-8 border-b pb-4">
                    <div className="text-center">
                      <h3 className="text-3xl font-semibold">{result.word}</h3>
                      {result.partOfspeech && (
                        <p className="text-xl font-medium text-blue-600 mt-2">
                          {result.partOfspeech}
                        </p>
                      )}
                      {result.formality && (
                        <p className="text-lg text-gray-400 mt-1">
                          Formality: {result.formality}
                        </p>
                      )}
                    </div>

                    {result.vebForms && (
                      <div className="mt-4 text-center">
                        <h4 className="text-xl font-medium">Verb Forms:</h4>
                        {result.vebForms.presentParticiple && (
                          <p>
                            Present Participle:{" "}
                            {result.vebForms.presentParticiple}
                          </p>
                        )}
                        {result.vebForms.pastTense && (
                          <p>Past Tense: {result.vebForms.pastTense}</p>
                        )}
                        {result.vebForms.pastParticiple && (
                          <p>
                            Past Participle: {result.vebForms.pastParticiple}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-6 space-y-6">
                      <div className="text-center">
                        {result.uk.transcription && (
                          <>
                            <span className="text-lg font-medium">
                              UK Transcription:
                            </span>
                            <p className="text-lg">{result.uk.transcription}</p>
                          </>
                        )}
                        {result.uk.audio && (
                          <CustomAudioPlayer
                            src={result.uk.audio}
                            label="UK Audio"
                            id={`uk-${index}`}
                          />
                        )}
                      </div>
                      <div className="text-center">
                        {result.us.transcription && (
                          <>
                            <span className="text-lg font-medium">
                              US Transcription:
                            </span>
                            <p className="text-lg">{result.us.transcription}</p>
                          </>
                        )}
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
                          {useCase.content && (
                            <h4 className="text-xl font-medium text-center">
                              {useCase.content}
                            </h4>
                          )}
                          <div className="mt-4 space-y-4">
                            {useCase.definition.map((def, j) => (
                              <div key={j} className="space-y-2">
                                {def.content && (
                                  <p className="text-lg">{def.content}</p>
                                )}
                                {def.lvl && (
                                  <p className="text-sm text-gray-400">
                                    Level: {def.lvl}
                                  </p>
                                )}
                                {def.translate && (
                                  <p className="text-sm text-gray-400">
                                    Translation: {def.translate}
                                  </p>
                                )}
                                {def.examples?.length > 0 && (
                                  <div>
                                    <p className="text-sm text-gray-400 font-medium">
                                      Examples:
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-gray-300">
                                      {def.examples.map(
                                        (example, k) =>
                                          example && <li key={k}>{example}</li>
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">No results found</p>
              )}

              {suggestions?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold">Related Terms:</h3>
                  <ul className="mt-2 space-y-1">
                    {suggestions.map(
                      (suggestion, index) =>
                        suggestion && (
                          <li
                            key={index}
                            className="text-lg text-blue-400 hover:underline cursor-pointer"
                            onClick={() => {
                              setQuery(suggestion);
                              handleSearch();
                            }}
                          >
                            {suggestion}
                          </li>
                        )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
