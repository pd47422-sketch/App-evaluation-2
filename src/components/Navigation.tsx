/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap, BarChart3, ClipboardPen, MessageSquare, Settings, Github } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sheetsUrlConnected: boolean;
}

export default function Navigation({ activeTab, setActiveTab, sheetsUrlConnected }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Escrutinio & Gráficos', icon: BarChart3 },
    { id: 'evaluate', label: 'Evaluar Docente', icon: ClipboardPen },
    { id: 'students', label: 'Buzón Alumnos', icon: MessageSquare },
    { id: 'sheets', label: 'Enlace Google Sheets', icon: Settings },
    { id: 'github', label: 'Manual GitHub Pages', icon: Github },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-100">
            <GraduationCap className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">EduEvalúa</h1>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest leading-none">Rúbrica Distrital</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1" aria-label="Tabs principales">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="hidden md:inline">{item.label}</span>

                {/* Connection Dot Indicator in Settings Tab */}
                {item.id === 'sheets' && (
                  <span className={`absolute top-1 right-1 flex h-2.5 w-2.5 rounded-full ${sheetsUrlConnected ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
