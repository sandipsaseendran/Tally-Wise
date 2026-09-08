import React, { useRef, useState } from 'react';
import EmptyState from '../components/EmptyState';
import { Files, UploadCloud, FileText, FileImage, File, Trash2, Download, Sparkles, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';
import { useStore } from '../../store/useStore';
import { generateId } from '../utils/helpers';
import { AppDocument } from '../types';
import { analyzeDocumentWithAI } from '../utils/geminiClient';
import ReactMarkdown from 'react-markdown';

export function Documents() {
  const documents = useStore((state) => state.documents);
  const addDocument = useStore((state) => state.addDocument);
  const deleteDocument = useStore((state) => state.deleteDocument);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [analyzingDocId, setAnalyzingDocId] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  const handleAnalyze = async (doc: AppDocument) => {
    setAnalyzingDocId(doc.id);
    setAnalysisResult('');
    setAnalysisLoading(true);
    
    const result = await analyzeDocumentWithAI(doc.dataUrl, doc.type);
    setAnalysisResult(result);
    setAnalysisLoading(false);
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newDoc: AppDocument = {
        id: generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        dataUrl,
      };
      addDocument(newDoc);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(handleFileUpload);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(handleFileUpload);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <FileImage className="w-8 h-8 text-blue-500" />;
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div 
      className={`flex-1 h-full overflow-y-auto no-scrollbar p-8 transition-colors ${
        isDragging ? 'bg-tally-primary/5' : ''
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">
          Documents
        </h1>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-tally-primary hover:bg-tally-primary/90 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors"
        >
          <UploadCloud size={20} />
          Upload Document
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileInputChange} 
          className="hidden" 
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.csv,.txt,.xls,.xlsx"
        />
      </div>

      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 dark:bg-black/40 backdrop-blur-sm rounded-tl-[40px] border-4 border-dashed border-tally-primary m-4 pointer-events-none">
          <div className="bg-white dark:bg-tally-surface-dark p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
            <UploadCloud className="w-12 h-12 text-tally-primary" />
            <span className="text-lg font-bold text-tally-text-primary dark:text-white">Drop files here to upload</span>
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="border-2 border-dashed border-tally-border-light dark:border-tally-border-dark rounded-3xl">
          <EmptyState 
            icon={<Files size={32} />}
            title="No Documents Found"
            description="Drag and drop your documents anywhere, or click upload. They will appear here once you do."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="bg-tally-bg-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark rounded-2xl p-5 hover:border-tally-primary/30 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white dark:bg-tally-bg-dark rounded-xl shadow-sm">
                  {getFileIcon(doc.type)}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={doc.dataUrl} 
                    download={doc.name}
                    className="p-1.5 text-tally-text-secondary hover:text-tally-primary hover:bg-tally-primary/10 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => handleAnalyze(doc)}
                    className="p-1.5 text-tally-text-secondary hover:text-tally-primary hover:bg-tally-primary/10 rounded-lg transition-colors"
                    title="Analyze with AI"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteDocument(doc.id)}
                    className="p-1.5 text-tally-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-tally-text-primary dark:text-white truncate mb-1" title={doc.name}>
                  {doc.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">
                  <span>{formatSize(doc.size)}</span>
                  <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Analysis Modal */}
      <Modal 
        isOpen={!!analyzingDocId} 
        onClose={() => setAnalyzingDocId(null)} 
        title="AI Document Analysis"
      >
        <div className="space-y-6 mt-4">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-tally-primary/10 to-transparent dark:bg-tally-surface-dark border border-tally-primary/20">
            <div className="w-10 h-10 shrink-0 rounded-full bg-tally-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-tally-primary dark:text-white" />
            </div>
            <div className="flex-1">
              {analysisLoading ? (
                <div className="flex items-center gap-2 text-tally-text-secondary py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Analyzing document...</span>
                </div>
              ) : (
                <div className="text-sm text-tally-text-secondary dark:text-tally-text-secondaryDark leading-relaxed">
                  {analysisResult ? (
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-xl font-bold text-tally-text-primary dark:text-white mt-4 mb-2" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold text-tally-text-primary dark:text-white mt-4 mb-2" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-base font-bold text-tally-text-primary dark:text-white mt-3 mb-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-tally-text-primary dark:text-white" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 my-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1 my-2" {...props} />,
                        li: ({node, ...props}) => <li {...props} />,
                        p: ({node, ...props}) => <p className="mb-2" {...props} />
                      }}
                    >
                      {analysisResult}
                    </ReactMarkdown>
                  ) : "No analysis available."}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
