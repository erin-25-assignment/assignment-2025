import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, ImageIcon, MicIcon } from './icons';
import { StudyMaterial, Language } from '../types';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs';

const pdfToText = async (file: File): Promise<string> => {
    // Set worker source right before it's used to prevent issues on initial load.
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => ('str' in item ? item.str : '')).join(' ') + '\n';
    }
    return fullText;
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

interface MaterialInputProps {
  onAnalyze: (material: StudyMaterial, subject: string) => void;
  language: Language;
}

const MaterialInput: React.FC<MaterialInputProps> = ({ onAnalyze, language }) => {
  const [subject, setSubject] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const text = {
    title: { ko: '학습 자료 업로드', en: 'Upload Study Material' },
    description: { ko: '복습하고 싶은 강의 자료를 업로드하세요.', en: 'Upload the lecture material you want to review.' },
    subjectPlaceholder: { ko: '과목명을 입력하세요 (예: 한국사, 미적분)', en: 'Enter subject name (e.g., History, Calculus)' },
    dropHere: { ko: '여기에 파일을 드래그 앤 드롭하거나', en: 'Drag and drop a file here or' },
    selectFile: { ko: '파일 선택', en: 'Select File' },
    processing: { ko: '처리 중...', en: 'Processing...' },
    or: { ko: '또는', en: 'or' },
    startRecording: { ko: '오디오 녹음 시작', en: 'Start Audio Recording' },
    stopRecording: { ko: '녹음 중지', en: 'Stop Recording' },
    recordingInProgress: { ko: '녹음이 진행 중입니다...', en: 'Recording in progress...' },
    supportedFiles: { ko: '지원 파일: PDF, PPT, TXT, JPG, PNG, MP3, WAV', en: 'Supported files: PDF, PPT, TXT, JPG, PNG, MP3, WAV' },
    fileSizeNotice: { ko: '최대 파일 크기는 10MB, 음성 녹음은 5분 내외를 권장합니다.', en: 'Max file size is 10MB, voice recording is recommended to be around 5 minutes.' },
    errorPrefix: { ko: '오류!', en: 'Error!' },
    errorSubject: { ko: '과목명을 입력해주세요.', en: 'Please enter a subject name.' },
    errorSubjectFirst: { ko: '과목명을 먼저 입력해주세요.', en: 'Please enter the subject name first.' },
    errorFileSize: { ko: `파일이 너무 큽니다. 최대 파일 크기는 ${MAX_FILE_SIZE / (1024 * 1024)}MB 입니다.`, en: `File is too large. Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` },
    errorPpt: { ko: 'PPT/PPTX 파일은 현재 직접 분석을 지원하지 않습니다. PDF로 변환하여 업로드해주세요.', en: 'PPT/PPTX files are not directly supported. Please convert to PDF and upload.' },
    errorUnsupported: { ko: '지원하지 않는 파일 형식입니다. PDF, PPT, TXT, 이미지, 오디오 파일을 업로드해주세요.', en: 'Unsupported file type. Please upload PDF, PPT, TXT, image, or audio files.' },
    errorProcessing: { ko: '파일 처리 중 오류가 발생했습니다. 다시 시도해 주세요.', en: 'An error occurred while processing the file. Please try again.' },
    errorMicAccess: { ko: '마이크에 접근할 수 없습니다. 권한을 확인해주세요.', en: 'Cannot access microphone. Please check permissions.' },
    errorMicSupport: { ko: '이 브라우저에서는 오디오 녹음을 지원하지 않습니다.', en: 'Audio recording is not supported in this browser.' },
  };

  const handleAnalysis = (material: StudyMaterial) => {
    if (!subject.trim()) {
        setError(text.errorSubject[language]);
        return;
    }
    onAnalyze(material, subject.trim());
  }

  const processFile = useCallback(async (file: File) => {
    setError(null);
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    if (file.size > MAX_FILE_SIZE) {
        setError(text.errorFileSize[language]);
        return;
    }
    
    setIsProcessing(true);
    try {
        if (fileType.startsWith('image/')) {
            const base64 = await fileToBase64(file);
            handleAnalysis({ type: 'image', content: base64, mimeType: fileType });
        } else if (fileType.startsWith('audio/')) {
            const base64 = await fileToBase64(file);
            handleAnalysis({ type: 'audio', content: base64, mimeType: fileType });
        } else if (fileType === 'application/pdf') {
            const textContent = await pdfToText(file);
            handleAnalysis({ type: 'text', content: textContent });
        } else if (fileType === 'text/plain') {
             const textContent = await file.text();
             handleAnalysis({ type: 'text', content: textContent });
        } else if (
            fileType === 'application/vnd.ms-powerpoint' ||
            fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
            fileName.endsWith('.ppt') ||
            fileName.endsWith('.pptx')
        ) {
            setError(text.errorPpt[language]);
        } else {
            setError(text.errorUnsupported[language]);
        }
    } catch (err) {
        console.error("File processing error:", err);
        setError(text.errorProcessing[language]);
    } finally {
        setIsProcessing(false);
    }
  }, [onAnalyze, subject, language]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!subject.trim()) {
        setError(text.errorSubjectFirst[language]);
        e.target.value = '';
        return;
    }
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  };

  const handleStartRecording = async () => {
    setError(null);
    if (!subject.trim()) {
        setError(text.errorSubjectFirst[language]);
        return;
    }
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = event => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const base64 = await fileToBase64(new File([audioBlob], "recording.webm", {type: "audio/webm"}));
                handleAnalysis({ type: 'audio', content: base64, mimeType: 'audio/webm' });
                stream.getTracks().forEach(track => track.stop()); // Stop microphone
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Mic access error:', err);
            setError(text.errorMicAccess[language]);
        }
    } else {
        setError(text.errorMicSupport[language]);
    }
  };

  const handleStopRecording = () => {
      if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
      }
  };


  const dragEvents = {
    onDragEnter: (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); },
    onDragLeave: (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); },
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (!subject.trim()) {
        setError(text.errorSubjectFirst[language]);
        return;
      }
      const file = e.dataTransfer.files?.[0];
      if (file) {
        processFile(file);
      }
    },
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
        <div className="flex flex-col items-center gap-8 w-full max-w-lg">
            <div className="flex flex-col items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">{text.title[language]}</h2>
                <p className="text-slate-600 dark:text-slate-400">{text.description[language]}</p>
            </div>
            <div className="w-full space-y-4">
                <div>
                    <label htmlFor="subject-input" className="sr-only">{language === 'ko' ? '과목명' : 'Subject'}</label>
                    <input
                        id="subject-input"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={text.subjectPlaceholder[language]}
                        className="w-full p-4 rounded-lg bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary text-text-light dark:text-text-dark"
                    />
                </div>

                <div 
                    {...dragEvents}
                    className={`relative flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 px-6 py-14 bg-white/50 dark:bg-slate-800/20 transition-colors ${isDragging ? 'border-primary' : ''}`}
                >
                    <div className="flex max-w-[480px] flex-col items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                            <UploadIcon className="text-4xl text-primary" />
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal max-w-[480px] text-center">{text.dropHere[language]}</p>
                        <label htmlFor="file-upload" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-accent hover:bg-accent/90 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-md transition-all duration-300">
                             <ImageIcon className="mr-2"/>
                            <span className="truncate">{isProcessing ? text.processing[language] : text.selectFile[language]}</span>
                        </label>
                         <input id="file-upload" type="file" accept="application/pdf, text/plain, image/*, audio/*, .ppt, .pptx, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation" className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0" onChange={handleFileChange} disabled={isProcessing || isRecording} />
                    </div>
                </div>

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-500">{text.or[language]}</span>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                </div>

                <div className="flex flex-col items-center">
                    <button onClick={isRecording ? handleStopRecording : handleStartRecording} disabled={isProcessing} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-red-600 hover:bg-red-700 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-md transition-all duration-300 disabled:bg-slate-400">
                        <MicIcon className="mr-2" />
                        <span>{isRecording ? text.stopRecording[language] : text.startRecording[language]}</span>
                    </button>
                    {isRecording && <p className="text-sm text-red-500 mt-2 animate-pulse">{text.recordingInProgress[language]}</p>}
                </div>

                <div className="text-slate-500 dark:text-slate-500 text-xs mt-6 font-normal leading-normal max-w-sm text-center mx-auto space-y-1">
                    <p>{text.supportedFiles[language]}</p>
                    <p>{text.fileSizeNotice[language]}</p>
                </div>
                 {error && (
                    <div className="w-full mt-4">
                        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                            <strong className="font-bold">{text.errorPrefix[language]}</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default MaterialInput;