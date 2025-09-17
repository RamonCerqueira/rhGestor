'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface Stats {
  totalEmployees: number;
  employeesOK: number;
  employeesPending: number;
  employeesAlert: number;
  documentsExpiringSoon: number;
}

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

export default function EmployeesReportPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // Consumindo API do backend Express
    fetch('http://localhost:3001/employees/stats/dashboard')
      .then(res => res.json())
      .then(setStats)
      .catch(err => console.error('Erro ao buscar estatísticas:', err));
  }, []);

  if (!stats) {
    return <div className="p-8">Carregando relatório...</div>;
  }

  const pieData = [
    { name: 'OK', value: stats.employeesOK },
    { name: 'Pendente', value: stats.employeesPending },
    { name: 'Alerta', value: stats.employeesAlert },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/employees" className="mr-4 text-gray-600 hover:text-gray-900">
                ← Voltar
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Relatório de Funcionários</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Cards resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500 text-sm">Total de Funcionários</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500 text-sm">Funcionários OK</h3>
            <p className="text-2xl font-bold text-green-600">{stats.employeesOK}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500 text-sm">Pendentes</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.employeesPending}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500 text-sm">Em Alerta</h3>
            <p className="text-2xl font-bold text-red-600">{stats.employeesAlert}</p>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Documentos vencendo */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentos vencendo em 30 dias</h3>
          <p className="text-2xl font-bold text-indigo-600">{stats.documentsExpiringSoon}</p>
          <p className="text-sm text-gray-500 mt-1">Funcionários com documentos próximos do vencimento</p>
        </div>
      </div>
    </div>
  );
}
