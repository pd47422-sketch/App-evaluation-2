/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import TeacherDashboard from './components/TeacherDashboard';
import EvaluationForm from './components/EvaluationForm';
import StudentFeedback from './components/StudentFeedback';
import SheetsSettings from './components/SheetsSettings';
import GitHubGuide from './components/GitHubGuide';
import { Teacher, Evaluation, StudentComment, SheetsConfig } from './types';
import { INITIAL_TEACHERS, INITIAL_EVALUATIONS, INITIAL_STUDENT_COMMENTS } from './data/presets';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core Data States
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [comments, setComments] = useState<StudentComment[]>([]);
  
  // Google Sheets Config State
  const [sheetsConfig, setSheetsConfig] = useState<SheetsConfig>({
    webAppUrl: '',
    isConnected: false
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  // Load Initial Data from localStorage OR fall back to hardcoded presets
  useEffect(() => {
    try {
      const storedTeachers = localStorage.getItem('eduevalua_teachers');
      const storedEvals = localStorage.getItem('eduevalua_evaluations');
      const storedComments = localStorage.getItem('eduevalua_comments');
      const storedConfig = localStorage.getItem('eduevalua_sheets_config');

      if (storedTeachers) setTeachers(JSON.parse(storedTeachers));
      else {
        setTeachers(INITIAL_TEACHERS);
        localStorage.setItem('eduevalua_teachers', JSON.stringify(INITIAL_TEACHERS));
      }

      if (storedEvals) setEvaluations(JSON.parse(storedEvals));
      else {
        setEvaluations(INITIAL_EVALUATIONS);
        localStorage.setItem('eduevalua_evaluations', JSON.stringify(INITIAL_EVALUATIONS));
      }

      if (storedComments) setComments(JSON.parse(storedComments));
      else {
        setComments(INITIAL_STUDENT_COMMENTS);
        localStorage.setItem('eduevalua_comments', JSON.stringify(INITIAL_STUDENT_COMMENTS));
      }

      if (storedConfig) {
        const parsedConfig = JSON.parse(storedConfig);
        setSheetsConfig(parsedConfig);
        
        // Auto-sync on load if connected
        if (parsedConfig.isConnected && parsedConfig.webAppUrl) {
          triggerSheetsSync(parsedConfig.webAppUrl);
        }
      }
    } catch (e) {
      console.error('Error loading localStorage datasets', e);
      // Fallback
      setTeachers(INITIAL_TEACHERS);
      setEvaluations(INITIAL_EVALUATIONS);
      setComments(INITIAL_STUDENT_COMMENTS);
    }
  }, []);

  // Utility to show temporary message notification
  const showToast = (type: 'success' | 'info' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  /**
   * Core Sync Logic: GET request to retrieve all records stored in the linked Google Sheet
   */
  const triggerSheetsSync = async (webAppUrl: string) => {
    try {
      showToast('info', 'Sincronizando con Google Sheets...');
      const res = await fetch(webAppUrl, {
        method: 'GET',
        mode: 'cors'
      });
      const result = await res.json();

      if (result && result.status === 'success' && result.data) {
        const { teachers: cloudTeachers, evaluations: cloudEvals, comments: cloudComments } = result.data;
        
        // Overwrite or merge if entries exist in cloud
        let mergedTeachers = [...teachers];
        if (cloudTeachers && cloudTeachers.length > 0) {
          // Keep cloud data as source of truth, adding newly created ones
          mergedTeachers = cloudTeachers;
          setTeachers(cloudTeachers);
          localStorage.setItem('eduevalua_teachers', JSON.stringify(cloudTeachers));
        }

        if (cloudEvals && cloudEvals.length > 0) {
          setEvaluations(cloudEvals);
          localStorage.setItem('eduevalua_evaluations', JSON.stringify(cloudEvals));
        }

        if (cloudComments && cloudComments.length > 0) {
          setComments(cloudComments);
          localStorage.setItem('eduevalua_comments', JSON.stringify(cloudComments));
        }

        const newCfg = {
          webAppUrl,
          isConnected: true,
          lastSyncedAt: new Date().toISOString()
        };
        setSheetsConfig(newCfg);
        localStorage.setItem('eduevalua_sheets_config', JSON.stringify(newCfg));
        
        showToast('success', '¡Base de datos escolar sincronizada con Google Sheets con éxito!');
      } else {
        showToast('error', 'Respuesta inesperada de Google Sheets. Verifica la dirección.');
      }
    } catch (err) {
      console.error('Fetch Google Sheets failed', err);
      showToast('error', 'Error al consultar Google Sheets. Asegúrate de autorizar permisos en Apps Script.');
    }
  };

  /**
   * Action handler: Registers a new teacher profile
   */
  const handleAddTeacher = async (newTeacher: Teacher) => {
    // 1. Update local state
    const updated = [newTeacher, ...teachers];
    setTeachers(updated);
    localStorage.setItem('eduevalua_teachers', JSON.stringify(updated));

    // 2. Synchronize to sheet if connected
    if (sheetsConfig.isConnected && sheetsConfig.webAppUrl) {
      try {
        const res = await fetch(sheetsConfig.webAppUrl, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'addTeacher', payload: newTeacher })
        });
        const result = await res.json();
        if (result && result.status === 'success') {
          showToast('success', `${newTeacher.name} guardado(a) en Google Sheets`);
        }
      } catch (err) {
        showToast('error', 'Error al registrar docente en Google Sheets. Se guardó localmente.');
      }
    } else {
      showToast('success', `Registro local de ${newTeacher.name} guardado correctamente`);
    }
  };

  /**
   * Action handler: Asents a rubric/evaluation
   */
  const handleSubmitEvaluation = async (evaluation: Evaluation): Promise<boolean> => {
    // 1. Update local state
    const updated = [evaluation, ...evaluations];
    setEvaluations(updated);
    localStorage.setItem('eduevalua_evaluations', JSON.stringify(updated));

    // 2. Sync to cloud sheet
    if (sheetsConfig.isConnected && sheetsConfig.webAppUrl) {
      try {
        const res = await fetch(sheetsConfig.webAppUrl, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'addEvaluation', payload: evaluation })
        });
        const result = await res.json();
        if (result && result.status === 'success') {
          showToast('success', 'Evaluación subida a Google Sheets');
          return true;
        }
        return false;
      } catch (err) {
        console.error(err);
        showToast('error', 'Fallo conexión de red a Sheets. Se guardó localmente.');
        return true; // We return true since it was safely kept in LocalStorage
      }
    }
    return true;
  };

  /**
   * Action handler: Submits a student comment
   */
  const handleSubmitComment = async (comment: StudentComment): Promise<boolean> => {
    // 1. Update local state
    const updated = [comment, ...comments];
    setComments(updated);
    localStorage.setItem('eduevalua_comments', JSON.stringify(updated));

    // 2. Sync to cloud sheet
    if (sheetsConfig.isConnected && sheetsConfig.webAppUrl) {
      try {
        const res = await fetch(sheetsConfig.webAppUrl, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'addComment', payload: comment })
        });
        const result = await res.json();
        if (result && result.status === 'success') {
          showToast('success', 'Tu comentario anónimo se guardó en Google Sheets');
          return true;
        }
        return false;
      } catch (err) {
        console.error(err);
        showToast('error', 'Comentario respaldado localmente (Offline fallback).');
        return true;
      }
    }
    return true;
  };

  /**
   * Linking logic: Updates and tests Google Sheets configuration
   */
  const handleUpdateSheetsConfig = async (newUrl: string): Promise<boolean> => {
    try {
      const testRes = await fetch(newUrl, {
        method: 'GET',
        mode: 'cors'
      });
      const testResult = await testRes.json();

      if (testResult && testResult.status === 'success') {
        const cloudData = testResult.data;
        if (cloudData) {
          if (cloudData.teachers && cloudData.teachers.length > 0) setTeachers(cloudData.teachers);
          if (cloudData.evaluations && cloudData.evaluations.length > 0) setEvaluations(cloudData.evaluations);
          if (cloudData.comments && cloudData.comments.length > 0) setComments(cloudData.comments);
        }

        const newCfg = {
          webAppUrl: newUrl,
          isConnected: true,
          lastSyncedAt: new Date().toISOString()
        };
        setSheetsConfig(newCfg);
        localStorage.setItem('eduevalua_sheets_config', JSON.stringify(newCfg));
        showToast('success', 'Enlace con Google Sheets establecido correctamente.');
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  /**
   * Unlinking logic
   */
  const handleDisconnectSheets = () => {
    const rawDefault = { webAppUrl: '', isConnected: false };
    setSheetsConfig(rawDefault);
    localStorage.setItem('eduevalua_sheets_config', JSON.stringify(rawDefault));
    showToast('info', 'Enlace Google Sheets desconectado. Operando de modo local (RAM-Cache).');
  };

  const handleManualSyncResponse = async () => {
    if (sheetsConfig.webAppUrl) {
      await triggerSheetsSync(sheetsConfig.webAppUrl);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans select-none antialiased">
      
      {/* Toast Notification HUD */}
      {notification && (
        <div className="fixed top-20 right-5 z-50 max-w-sm w-full bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xl flex items-start gap-2.5 animate-bounce">
          {notification.type === 'success' && (
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          )}
          {notification.type === 'error' && (
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
          )}
          {notification.type === 'info' && (
            <RefreshCw className="h-5 w-5 text-indigo-500 animate-spin shrink-0" />
          )}
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-800">
              {notification.type === 'success' ? 'Operación Exitosa' : notification.type === 'error' ? 'Operación Fallida' : 'Procesando...'}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5 font-medium leading-relaxed">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Main navigation menu */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sheetsUrlConnected={sheetsConfig.isConnected} 
      />

      {/* Dynamic Screen Content routing */}
      <main className="flex-grow">
        {activeTab === 'dashboard' && (
          <TeacherDashboard 
            teachers={teachers} 
            evaluations={evaluations} 
            comments={comments} 
            onAddTeacher={handleAddTeacher}
          />
        )}
        {activeTab === 'evaluate' && (
          <EvaluationForm 
            teachers={teachers} 
            onSubmitEvaluation={handleSubmitEvaluation}
          />
        )}
        {activeTab === 'students' && (
          <StudentFeedback 
            teachers={teachers} 
            onSubmitComment={handleSubmitComment}
          />
        )}
        {activeTab === 'sheets' && (
          <SheetsSettings 
            config={sheetsConfig} 
            onUpdateConfig={handleUpdateSheetsConfig} 
            onDisconnect={handleDisconnectSheets}
            onSyncNow={handleManualSyncResponse}
          />
        )}
        {activeTab === 'github' && (
          <GitHubGuide />
        )}
      </main>

      {/* Simple Footer decorative elements */}
      <footer className="border-t border-slate-200/60 bg-white py-6 mt-8 print:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10.5px] text-slate-400 font-medium">
          <div>
            <span>UVP Colegio de San Jerónimo • Distrito Escolar Docente</span>
          </div>
          <div>
            <span>EduEvalúa Web Platform © {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
