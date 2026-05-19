import React, { useState } from 'react';
import {
  Activity,
  Thermometer,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Send,
  Terminal,
  Cpu,
  Layers,
  HelpCircle
} from 'lucide-react';

interface SensorData {
  sensorId: string;
  temperature: number;
  pressure: number;
  plcStatus: string;
  isCorrupt: boolean;
  errorMessage?: string;
}

export default function App() {
  const [liveSensor, setLiveSensor] = useState<SensorData | null>(null);
  const [inputPayload, setInputPayload] = useState('SENSOR_ZONE_C;24.0;ERROR_VAL;RUNNING');
  const [isLoading, setIsLoading] = useState(false);

  // -------------------------------------------------------------------------
  // CONEXIÓN REAL CON EL BACKEND API REST DE .NET 10
  // -------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5200/api/telemetry/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload: inputPayload }),
      });

      const data = await response.json();

      // Asignamos la respuesta estructurada de .NET directamente al estado
      setLiveSensor(data);

    } catch (error) {
      console.error("Error de conexión con la API:", error);
      // Fallback visual elegante si la API de .NET está caída en local
      setLiveSensor({
        sensorId: 'ERR_NET_CONN',
        temperature: 0,
        pressure: 0,
        plcStatus: 'OFFLINE',
        isCorrupt: true,
        errorMessage: 'NetworkError: No se pudo establecer conexión con el servidor de validación en http://localhost:5200.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1329] bg-radial-at-t from-[#1c2541] to-[#0b1329] text-slate-100 p-6 md:p-12 font-sans selection:bg-cyan-500 selection:text-slate-900">

      {/* GLOWING HEADER */}
      <header className="mb-12 border-b border-slate-800/80 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
            <Activity className="text-cyan-400 w-10 h-10 relative z-10 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Agentic Telemetry Guard
              </h1>
              <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded font-mono font-bold">
                v10.0-Beta
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-400 font-medium">Control de Ingesta IoT Industrial bajo Gobernanza Agéntica IA</p>
          </div>
        </div>

        {/* TICKET CONTEXT BADGE */}
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-3 shadow-2xl">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
          <span className="text-xs font-mono font-bold tracking-wider text-slate-300">
            CONTEXTO ACTIVO: <span className="text-amber-400 text-sm">#GH-600</span>
          </span>
        </div>
      </header>

      {/* MAIN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: CONTROL PANEL & INJECTOR (FORM) */}
        <div className="lg:col-span-5 bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/60 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>

          <h2 className="text-md font-bold mb-3 flex items-center gap-2 text-cyan-400 tracking-wide uppercase text-sm font-mono">
            <Terminal className="w-4 h-4 text-cyan-400" /> Inyector de Tramas de Planta
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Modifica los valores del string para emular comportamientos del PLC físico. Provoca errores alfanuméricos para auditar la respuesta del orquestador.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="flex justify-between text-[11px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
                <span>Payload Crudo (Raw Stream)</span>
                <span className="text-slate-500">Separador: Semicolon (;)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={inputPayload}
                  onChange={(e) => setInputPayload(e.target.value)}
                  className="w-full bg-[#070d19] border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-inner tracking-wide"
                  placeholder="SENSOR_ID;TEMPERATURE;PRESSURE;STATUS"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group/btn bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold text-xs uppercase tracking-widest p-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-950/20 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              {isLoading ? 'Conectando con API .NET...' : 'Inyectar Datos al Bus'}
            </button>
          </form>

          {/* PRESETS CHIPS */}
          <div className="mt-8 pt-5 border-t border-slate-800/80 space-y-3">
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-widest">Escenarios de Auditoría:</span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setInputPayload('SENSOR_ZONE_C;24.5;1012.1;RUNNING')}
                className="w-full text-left p-2.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 transition-colors flex justify-between items-center group/chip"
              >
                <span className="font-mono text-xs text-emerald-400 group-hover/chip:text-emerald-300">🟢 Payload Estándar (Telemetry OK)</span>
                <span className="text-[10px] font-mono text-emerald-600">Pure Data</span>
              </button>
              <button
                type="button"
                onClick={() => setInputPayload('SENSOR_ZONE_C;24.0;ERROR_VAL;RUNNING')}
                className="w-full text-left p-2.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-colors flex justify-between items-center group/chip"
              >
                <span className="font-mono text-xs text-red-400 group-hover/chip:text-red-300">🔴 Trama Corrupta (Disparador #GH-600)</span>
                <span className="text-[10px] font-mono text-red-600 font-bold animate-pulse">Parser Crash</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INDUSTRIAL REAL-TIME MONITOR */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-500" /> Monitorización de Nodos Activos
            </h2>
          </div>

          {liveSensor ? (
            <div className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-2xl bg-gradient-to-b ${liveSensor.isCorrupt
              ? 'from-red-950/30 via-[#0b1329] to-[#0b1329] border-red-900/40 shadow-red-950/10'
              : 'from-slate-900/80 via-[#0b1329] to-[#0b1329] border-slate-800'
              }`}>

              {/* TELEMETRY CARD TOP BAR */}
              <div className={`px-6 py-4 flex justify-between items-center border-b ${liveSensor.isCorrupt ? 'border-red-900/30 bg-red-950/10' : 'border-slate-800 bg-slate-900/40'
                }`}>
                <div className="flex items-center gap-2.5">
                  <Layers className={`w-4 h-4 ${liveSensor.isCorrupt ? 'text-red-400' : 'text-cyan-400'}`} />
                  <span className="text-sm font-mono font-black tracking-wider text-slate-200">{liveSensor.sensorId}</span>
                </div>

                {liveSensor.isCorrupt ? (
                  <span className="flex items-center gap-1.5 bg-red-500/10 text-red-400 text-[10px] tracking-widest font-mono px-3 py-1 rounded-full border border-red-500/20 font-bold animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> PARSER_FATAL_CRASH
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] tracking-widest font-mono px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
                    <CheckCircle className="w-3 h-3" /> STREAM_ONLINE
                  </span>
                )}
              </div>

              {/* GAUGES PANEL */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* TEMP BOX */}
                <div className="bg-[#070d19]/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between group">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-slate-500" /> Temperatura
                    </span>
                    <p className={`text-2xl font-mono font-bold tracking-tight ${liveSensor.isCorrupt ? 'text-red-500/50' : 'text-slate-100'}`}>
                      {liveSensor.isCorrupt ? 'ERR_NULL' : `${liveSensor.temperature} °C`}
                    </p>
                  </div>
                </div>

                {/* PRESSURE BOX */}
                <div className="bg-[#070d19]/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-slate-500" /> Presión Atmosférica
                    </span>
                    <p className={`text-2xl font-mono font-bold tracking-tight ${liveSensor.isCorrupt ? 'text-red-500/50' : 'text-slate-100'}`}>
                      {liveSensor.isCorrupt ? 'ERR_NULL' : `${liveSensor.pressure} hPa`}
                    </p>
                  </div>
                </div>
              </div>

              {/* TELEMETRY RAW CONSOLE LOG */}
              <div className="px-6 pb-6 pt-2">
                <div className={`p-4 rounded-xl font-mono text-xs border ${liveSensor.isCorrupt
                  ? 'bg-red-950/20 border-red-900/30 text-red-300'
                  : 'bg-[#050a14] border-slate-800/80 text-slate-400'
                  }`}>
                  <div className="flex justify-between items-center mb-2 text-[10px] text-slate-500 font-bold tracking-widest uppercase border-b border-slate-800 pb-1.5">
                    <span>Terminal Diagnóstico .NET 10</span>
                    <span className={liveSensor.isCorrupt ? 'text-red-400' : 'text-emerald-400'}>
                      {liveSensor.isCorrupt ? 'STATUS: 400' : 'STATUS: 200'}
                    </span>
                  </div>

                  {liveSensor.isCorrupt ? (
                    <div className="space-y-2">
                      <p className="text-red-400 font-semibold">{liveSensor.errorMessage}</p>
                      <div className="pt-2 border-t border-red-900/20 text-[11px] text-slate-400 flex flex-col gap-1.5 leading-relaxed">
                        <p>💡 <strong className="text-amber-400">Gobernanza Agéntica Activa:</strong> El orquestador de GitHub Actions interceptó esta firma crítica en el log.</p>
                        <p>🤖 <strong className="text-cyan-400">Pipeline Workflow:</strong> Generando sandbox autónomo para migrar el parser a un modelo basado en <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-bold">double.TryParse()</code>.</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-emerald-400">
                      Telemetry core processed packet stream successfully. Data registers written to memory. PLC State: <span className="font-bold">{liveSensor.plcStatus}</span>
                    </p>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="border border-slate-800/80 bg-slate-900/10 backdrop-blur-sm p-16 text-center rounded-2xl text-slate-500 text-xs font-mono tracking-wider uppercase flex flex-col items-center justify-center gap-3">
              <HelpCircle className="w-8 h-8 text-slate-700 animate-bounce" />
              Esperando inyección de datos en el bus de planta...
            </div>
          )}
        </div>

      </div>
    </div>
  );
}