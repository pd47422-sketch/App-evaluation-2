/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Settings, FileSpreadsheet, Check, RefreshCw, AlertCircle, Sparkles, Copy } from 'lucide-react';
import { SheetsConfig } from '../types';

interface SheetsSettingsProps {
  config: SheetsConfig;
  onUpdateConfig: (newUrl: string) => Promise<boolean>;
  onDisconnect: () => void;
  onSyncNow: () => Promise<void>;
}

export default function SheetsSettings({ config, onUpdateConfig, onDisconnect, onSyncNow }: SheetsSettingsProps) {
  const [inputUrl, setInputUrl] = useState(config.webAppUrl);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [copiedScript, setCopiedScript] = useState(false);

  // Complete, fully functional Google Apps Script snippet ready to copy-paste.
  const appsScriptCode = `/*
  EduEvalúa - Script de Vinculación de Base de Datos Escolar en Google Sheets
  Instrucciones: 
  1. Abre tu Google Sheets, crea una hoja de cálculo en blanco.
  2. Ve al menú superior "Extensiones" -> "Apps Script".
  3. Borra todo el código que haya y pega este bloque completo.
  4. Da clic en "Guardar" (ícono de disco).
  5. Haz clic en "Implementar" -> "Nueva implementación".
  6. Selecciona tipo: "Aplicación Web".
  7. Configura: 
     - Descripción: "Base Datos EduEvalua"
     - Ejecutar como: "Tú (Tu dirección de correo)"
     - Quién tiene acceso: "Cualquiera" (IMPORTANTE para permitir peticiones anónimas de alumnos).
  8. Da clic en "Implementar", autoriza permisos si lo solicita, y COPIA la "URL de la aplicación web".
  9. Pega esa URL en el bloque de abajo de esta aplicación.
*/

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  setupSheetSchema(ss);
  
  var response = {
    teachers: getSheetData(ss.getSheetByName("Docentes")),
    evaluations: getSheetData(ss.getSheetByName("Evaluaciones")),
    comments: getSheetData(ss.getSheetByName("Comentarios"))
  };
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success", data: response }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    setupSheetSchema(ss);
    
    var requestData = JSON.parse(e.postData.contents);
    var action = requestData.action;
    var payload = requestData.payload;
    
    if (action === "addTeacher") {
      var sheet = ss.getSheetByName("Docentes");
      sheet.appendRow([
        payload.id,
        payload.name,
        payload.level,
        payload.grade,
        payload.subject,
        payload.avatar,
        payload.email || ""
      ]);
      return createCorsSuccessResponse();
    } 
    else if (action === "addEvaluation") {
      var sheet = ss.getSheetByName("Evaluaciones");
      sheet.appendRow([
        payload.id,
        payload.teacherId,
        payload.date,
        payload.evaluatorName,
        payload.role,
        payload.scores.planeacion,
        payload.scores.pedagogia,
        payload.scores.controlGrupo,
        payload.scores.evaluacion,
        payload.scores.profesionalismo,
        payload.comments,
        payload.academicYear
      ]);
      return createCorsSuccessResponse();
    } 
    else if (action === "addComment") {
      var sheet = ss.getSheetByName("Comentarios");
      sheet.appendRow([
        payload.id,
        payload.teacherId,
        payload.date,
        payload.comment,
        payload.rating,
        payload.level,
        payload.grade,
        payload.subject,
        payload.sentiment || "neutro"
      ]);
      return createCorsSuccessResponse();
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Acción no reconocida" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  }
}

function createCorsSuccessResponse() {
  return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Registro guardado" }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

function getSheetData(sheet) {
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Solo cabecera
  
  var headers = data[0];
  var rows = [];
  
  for (var i = 1; i < data.length; i++) {
    var rawRow = data[i];
    var rowObj = {};
    for (var j = 0; j < headers.length; j++) {
      rowObj[headers[j]] = rawRow[j];
    }
    
    // Parseo especial para objetos de evaluación anidados si aplica
    if (sheet.getName() === "Evaluaciones") {
      rowObj.scores = {
        planeacion: Number(rowObj.planeacion),
        pedagogia: Number(rowObj.pedagogia),
        controlGrupo: Number(rowObj.controlGrupo),
        evaluacion: Number(rowObj.evaluacion),
        profesionalismo: Number(rowObj.profesionalismo)
      };
    }
    if (sheet.getName() === "Comentarios") {
      rowObj.rating = Number(rowObj.rating);
    }
    rows.push(rowObj);
  }
  return rows;
}

function setupSheetSchema(ss) {
  // Asegurar hoja Docentes
  var sheetDocentes = ss.getSheetByName("Docentes");
  if (!sheetDocentes) {
    sheetDocentes = ss.insertSheet("Docentes");
    sheetDocentes.appendRow(["id", "name", "level", "grade", "subject", "avatar", "email"]);
  }
  
  // Asegurar hoja Evaluaciones
  var sheetEvals = ss.getSheetByName("Evaluaciones");
  if (!sheetEvals) {
    sheetEvals = ss.insertSheet("Evaluaciones");
    sheetEvals.appendRow(["id", "teacherId", "date", "evaluatorName", "role", "planeacion", "pedagogia", "controlGrupo", "evaluacion", "profesionalismo", "comments", "academicYear"]);
  }
  
  // Asegurar hoja Comentarios
  var sheetComs = ss.getSheetByName("Comentarios");
  if (!sheetComs) {
    sheetComs = ss.insertSheet("Comentarios");
    sheetComs.appendRow(["id", "teacherId", "date", "comment", "rating", "level", "grade", "subject", "sentiment"]);
  }
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleConnect = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setTestStatus('testing');
    try {
      const isOk = await onUpdateConfig(inputUrl.trim());
      if (isOk) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch (err) {
      setTestStatus('error');
    }
  };

  const [syncing, setSyncing] = useState(false);
  const handleSyncNow = async () => {
    setSyncing(true);
    await onSyncNow();
    setSyncing(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header Info */}
      <div className="mb-8 border-b border-slate-100 pb-5">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="h-6.5 w-6.5 text-emerald-600" />
          Enlace de Datos a Google Sheets
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Configura un enlace directo transparente con una hoja de cálculo en la nube para guardar de forma permanente y en tiempo real todo tu registro docente y comentarios escolares.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left pane: Connection form (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <Settings className="h-4.5 w-4.5" />
              Estado del Enlace
            </h3>

            {config.isConnected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 font-bold">
                  <Check className="h-5 w-5 bg-emerald-100 p-0.5 rounded-full text-emerald-700" />
                  <div>
                    <span>Servicio Enlazado Exitosamente</span>
                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5">La app lee y escribe en tu Google Sheet.</p>
                  </div>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="block font-bold">URL de Apps Script:</span>
                  <p className="font-mono bg-slate-50 p-2 rounded border border-slate-150 text-[10px] break-all truncate mt-1">
                    {config.webAppUrl}
                  </p>
                </div>

                {config.lastSyncedAt && (
                  <p className="text-[10px] text-slate-400 font-medium">
                    Sincronización manual: {new Date(config.lastSyncedAt).toLocaleString('es-MX')}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleSyncNow}
                    disabled={syncing}
                    className="flex-grow flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg shadow-sm transition"
                  >
                    <RefreshCw className={`h-4 w-4 text-slate-500 ${syncing ? 'animate-spin' : ''}`} />
                    <span>{syncing ? 'Refrescando...' : 'Sincronizar Ya'}</span>
                  </button>
                  <button
                    onClick={onDisconnect}
                    className="px-3 py-2 text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-100 transition"
                  >
                    Desconectar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConnect} className="space-y-4">
                <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-800 font-bold">
                  <AlertCircle className="h-5 w-5 animate-pulse text-amber-600 shrink-0" />
                  <div>
                    <span>Operando en Modo Local (RAM)</span>
                    <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Los datos cargados son temporales de demostración.</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">URL de Implementación de Apps Script</label>
                  <input
                    type="url"
                    required
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
                  />
                  <p className="text-[10.5px] text-slate-400 leading-snug">
                    Sigue las instrucciones del panel derecho para obtener esta clave ejecutando tu servicio en Google Sheets de forma gratuita.
                  </p>
                </div>

                {testStatus === 'error' && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-[11px] text-rose-700 font-semibold flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>Error de Verificación. Asegúrate de configurar la implementación abierta a "Cualquiera" y que la dirección web sea correcta.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={testStatus === 'testing'}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {testStatus === 'testing' ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Probando Conexión...</span>
                    </>
                  ) : (
                    <span>Probar & Vincular Google Sheet</span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Quick specs card */}
          <div className="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100/60 text-xs text-indigo-950 flex flex-col gap-2">
            <h4 className="font-bold text-indigo-950 flex items-center gap-1">
              <Sparkles className="h-4.5 w-4.5" /> Generación Inteligente de Tablas
            </h4>
            <p className="leading-relaxed text-indigo-900">
              El script incluye código automatizado que crea y le da formato por sí solo a las tres bases de datos (pestañas virtuales) en tu Google Sheet en su primera ejecución si no las tienes creadas:
            </p>
            <ul className="list-disc leading-relaxed pl-4 space-y-1 mt-1 text-indigo-900 font-semibold">
              <li>Pestaña "Docentes" (Catálogo general)</li>
              <li>Pestaña "Evaluaciones" (Anotaciones y rúbricas)</li>
              <li>Pestaña "Comentarios" (Opinión anónima)</li>
            </ul>
          </div>
        </div>

        {/* Right pane: Guide and code copy-paste (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Código del Google Apps Script</h3>
              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-bold transition cursor-pointer"
              >
                {copiedScript ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedScript ? 'Copiado' : 'Copiar Código'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="text-[10px] font-mono bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto max-h-[30rem] scrollbar-thin select-all">
                {appsScriptCode}
              </pre>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
