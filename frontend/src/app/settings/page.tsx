'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('Minha Empresa LTDA');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [docAlertDays, setDocAlertDays] = useState(30);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode enviar para uma API (POST /settings)
    console.log({ companyName, theme, docAlertDays });
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="mr-4 text-gray-600 hover:text-gray-900">
                ← Voltar
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Configurações</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSave}
          className="bg-white rounded-xl shadow-sm p-6 space-y-6"
        >
          {/* Empresa */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Empresa</h2>
            <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Aparência */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Aparência</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
            </select>
          </div>

          {/* Alertas */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertas de Documentos</h2>
            <label className="block text-sm font-medium text-gray-700">
              Dias antes do vencimento para alerta
            </label>
            <input
              type="number"
              min={1}
              value={docAlertDays}
              onChange={(e) => setDocAlertDays(Number(e.target.value))}
              className="mt-1 block w-32 border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Botão */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
