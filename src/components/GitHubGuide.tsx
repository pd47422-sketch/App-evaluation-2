/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Github, Play, ArrowRight, CheckCircle2, Terminal, Code, Settings, Globe } from 'lucide-react';

export default function GitHubGuide() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: 'Crear el repositorio',
      icon: Globe,
      desc: 'Crea tu repositorio vacío en GitHub'
    },
    {
      id: 2,
      title: 'Subir el Código',
      icon: Terminal,
      desc: 'Vincula la aplicación local y sube los archivos'
    },
    {
      id: 3,
      title: 'Menú Pages',
      icon: Settings,
      desc: 'Enciende GitHub Pages con un solo botón en repositorio'
    },
    {
      id: 4,
      title: '¡Listo en la Web!',
      icon: CheckCircle2,
      desc: 'Visita tu nueva aplicación de evaluación escolar'
    }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header Info */}
      <div className="mb-8 border-b border-slate-100 pb-5">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Github className="h-6.5 w-6.5 text-slate-800" />
          Manual de Publicación en GitHub Pages (Paso a Paso)
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          La aplicación ya está configurada con **rutas relativas automatizadas (Vite Base Relativa)**. Esto garantiza que funcionará instantáneamente al subirla a cualquier repositorio sin necesidad de modificar el código.
        </p>
      </div>

      {/* Progress Dots Step Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {steps.map((st) => {
          const Icon = st.icon;
          const isActive = activeStep === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setActiveStep(st.id)}
              className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                isActive 
                  ? 'bg-indigo-50/50 border-indigo-200 shadow-md ring-1 ring-indigo-100' 
                  : 'bg-white border-slate-150 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  PASO {st.id}
                </span>
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 leading-snug truncate">{st.title}</h4>
                <p className="text-[10px] text-slate-550 leading-tight mt-0.5">{st.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic step detail container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-150 shadow-sm min-h-[22rem] flex flex-col justify-between">
        
        {activeStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">1</span>
              Crear Repositorio en GitHub
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Dado que perteneces a la UVP, puedes registrar tu proyecto usando tu cuenta académica o personal de GitHub. Sigue estos pasos para prepararlo:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-600 leading-relaxed">
              <li>Inicia sesión en su cuenta en <a href="https://github.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">GitHub.com</a>.</li>
              <li>Da clic en el botón <strong className="text-slate-800 font-bold">"New"</strong> (Nuevo repositorio) en la esquina superior izquierda.</li>
              <li>Asigna un nombre descriptivo al repositorio, por ejemplo: <code className="font-mono bg-slate-50 border border-slate-150 px-1 py-0.5 rounded text-indigo-700">evaluacion-docente</code>.</li>
              <li>Asegúrate de dejar seleccionada la casilla <strong className="text-slate-800 font-bold">"Public"</strong> (Público) para que GitHub Pages sea accesible de forma gratuita.</li>
              <li><strong className="text-rose-600">IMPORTANTE:</strong> NO marques ninguna casilla de agregar README, .gitignore o licencia (deja todo en blanco).</li>
              <li>Da clic en el botón verde <strong className="text-slate-850 font-bold">"Create repository"</strong>.</li>
            </ol>
            <div className="bg-indigo-50/50 p-4 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 leading-relaxed">
              <strong>Nota Tecnológica UVP:</strong> La aplicación utiliza el adaptador de compilación directa Vite static HTML index, lo que permite que se mude de modo directo como archivo escolar sin necesidad de pagar servidores de renta.
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">2</span>
              Emparejar y Subir el Código
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Puedes descargar la carpeta completa del código fuente de esta aplicación dando clic en el menú superior izquierdo "Exportar como ZIP" de esta plataforma de desarrollo, o abrir tu consola Git favorita y lanzar las siguientes líneas en tu carpeta de proyecto:
            </p>
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase leading-none">
                <span>Comandos de Consola / Terminal</span>
              </div>
              <div className="bg-slate-900 text-slate-100 text-xs font-mono p-4 rounded-xl space-y-1 overflow-x-auto">
                <p><span className="text-slate-400"># 1. Inicia Git en la carpeta descargada</span></p>
                <p>git init</p>
                <p><span className="text-slate-400"># 2. Agrega todos los archivos</span></p>
                <p>git add .</p>
                <p>git commit -m <span className="text-indigo-400">"First commit: EduEvalua completo"</span></p>
                <p>git branch -M main</p>
                <p><span className="text-slate-400"># 3. Reemplaza con la dirección de tu nuevo repositorio</span></p>
                <p>git remote add origin https://github.com/<span className="text-emerald-400">TU_USUARIO_GITHUB</span>/evaluacion-docente.git</p>
                <p><span className="text-slate-400"># 4. Sube la rama principal</span></p>
                <p>git push -u origin main</p>
              </div>
            </div>

            <div className="bg-amber-50 p-3.5 border border-amber-100 rounded-xl text-[11px] text-amber-900 leading-relaxed">
              <strong>Procedimiento alternativo simplificado sin Consola:</strong> ¡También puedes compilar tu código de forma local con las instrucciones del siguiente paso y subir directamente la carpeta <code className="font-mono bg-white border px-1 rounded font-bold">dist/</code> usando la interfaz web de subir archivos de GitHub!
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">3</span>
              Pestaña automática GitHub Pages
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-bold">
              ¡La app ya viene lista con un archivo de acción automatizada de GitHub Actions para que no tengas que compilar nada localmente en tu computadora!
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sigue estos sencillos pasos directamente en la página web de tu repositorio de GitHub recién subido:
            </p>
            <ol className="list-decimal pl-5 space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <li>Ve a la pestaña superior derecha del menú <strong className="text-slate-850">"Settings"</strong> (Configuración) de tu repositorio.</li>
              <li>En la lista lateral izquierda, haz clic en la sección <strong className="text-indigo-600 font-bold">"Pages"</strong>.</li>
              <li>En la sección central llama <strong className="text-slate-800">"Build and deployment"</strong> - <strong className="text-slate-800">"Source"</strong>:
                <p className="mt-1 flex items-center gap-1.5 p-1 px-2.5 rounded bg-slate-50 border border-slate-150 font-semibold w-fit text-[11px] text-slate-700">
                  Selecciona la opción: <span className="font-mono text-indigo-700">"GitHub Actions"</span>
                </p>
              </li>
              <li>¡Eso es todo! No requieres programar ni configurar ninguna otra llave extra. Al seleccionar esta opción, el sistema detectará el archivo de flujo de trabajo que pre-creamos y compilará la página de modo inmediato de fondo.</li>
            </ol>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-4 text-center py-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto text-2xl mb-2.5">
              ✓
            </div>
            <h3 className="text-base font-bold text-slate-900">¡Tu Evaluación Docente ya está Online!</h3>
            <p className="text-xs text-slate-650 max-w-lg mx-auto leading-relaxed">
              GitHub procesará tus archivos en unos 30 segundos. Verás aparecer un gran banner verde en la misma pestaña "Pages" con tu nueva dirección URL pública de Internet, habilitada con candado SSL gratis.
            </p>
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl max-w-md mx-auto text-left text-xs text-slate-600 space-y-1.5">
              <span className="font-bold text-slate-700">¿Cuál será la URL de mi página?</span>
              <p className="font-mono text-indigo-600 font-semibold">
                https://TU_USUARIO_GITHUB.github.io/evaluacion-docente/
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                Podrás abrir esta URL desde cualquier celular, tableta o computadora del distrito escolar para evaluar o permitir que los alumnos dejen sus comentarios de forma anónima, conectando directamente con las hojas de cálculo.
              </p>
            </div>
          </div>
        )}

        {/* Next/Prev simple triggers */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-5 mt-4">
          <button
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            disabled={activeStep === 1}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
          >
            Anterior
          </button>
          
          <div className="text-xs text-slate-400 font-bold">
            Paso {activeStep} de 4
          </div>

          <button
            onClick={() => setActiveStep(prev => Math.min(4, prev + 1))}
            disabled={activeStep === 4}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl shadow-sm transition disabled:opacity-30 cursor-pointer"
          >
            <span>Siguiente Paso</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
