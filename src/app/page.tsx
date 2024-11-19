"use client";

import { useEffect, useState } from 'react';
import Section from './components/Section';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [code, setCode] = useState('// 여기에 코드를 입력하세요');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [musicResponse, setMusicResponse] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerateMusic = async () => {
    try {
      setIsLoading(true);
      setAudioUrl(null);
      setMusicResponse('');
      // 프롬프트 생성 요청
      const promptResponse = await fetch('/v1/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const promptData = await promptResponse.json();
      setGeneratedPrompt(promptData.prompt);

      // 음악 생성 요청
      const musicResponse = await fetch('/v1/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptData.prompt }),
      });

      // blob으로 응답 처리
      const audioBlob = await musicResponse.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      setMusicResponse('음악이 생성되었습니다.');

    } catch (error) {
      console.error('음악 생성 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // cleanup 함수 추가
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <>
      <Section className="my-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">코드를 입력하세요!</h2>
          <CodeMirror
            value={code}
            height="400px"
            theme={oneDark}
            extensions={[javascript({ jsx: true })]}
            onChange={(value) => setCode(value)}
            className="border rounded-lg shadow-lg overflow-hidden"
          />
          <div className="mt-4 flex justify-end">
            <button
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                isLoading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
              onClick={handleGenerateMusic}
            >
              {isLoading ? '생성 중...' : '음악 생성하기'}
            </button>
          </div>

          {/* 프롬프트 결과 표시 섹션 */}
          {(generatedPrompt) && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <ReactMarkdown className="text-white prose prose-invert max-w-none">
                {generatedPrompt}
              </ReactMarkdown>
            </div>
          )}

          {/* 음악 결과 표시 섹션 */}
          {musicResponse && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-2">생성된 음악</h3>
              <div className="text-white">
                {audioUrl && (
                  <audio controls className="w-full mt-2">
                    <source src={audioUrl} type="audio/mpeg" />
                    브라우저가 오디오 재생을 지원하지 않습니다.
                  </audio>
                )}
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
