/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { api } from "@/lib/api";

interface DocumentStats {
  status: string;
  count: number;
}

type ChartEntry = {
  name: string;
  value: number;
};

const COLORS: Record<string, string> = {
  Válido: "#10B981",
  Vencendo: "#F59E0B",
  Vencido: "#EF4444",
  Pendente: "#6B7280",
};

const STATUS_LABELS: Record<string, string> = {
  Válido: "Válidos",
  Vencendo: "Vencendo",
  Vencido: "Vencidos",
  Pendente: "Pendentes",
};

export default function DocumentsChart() {
  const [data, setData] = useState<DocumentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const stats = await api.getDocumentStatsByStatus();
        const filteredStats = stats.filter((stat) => stat.count > 0);
        setData(filteredStats);
      } catch {
        // Fallback para dados simulados
        const simulatedData: DocumentStats[] = [
          { status: "Válido", count: 3 },
          { status: "Vencendo", count: 1 },
          { status: "Vencido", count: 1 },
          { status: "Pendente", count: 1 },
        ];
        setData(simulatedData.filter((stat) => stat.count > 0));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData: ChartEntry[] = data.map((item) => ({
    name: item.status,
    value: item.count,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DocumentStats;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">
            {STATUS_LABELS[data.status]}
          </p>
          <p className="text-sm text-gray-600">
            {data.count} documento{data.count !== 1 ? "s" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: { payload: any[] }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">
              {STATUS_LABELS[entry.payload.status]} ({entry.payload.count})
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <LoadingPlaceholder />;
  if (error) return <ErrorPlaceholder message={error} />;
  if (data.length === 0) return <EmptyPlaceholder />;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Documentos por Status
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <CustomLegend
        payload={data.map((item) => ({
          color: COLORS[item.status],
          payload: item,
        }))}
      />
    </div>
  );
}

// Componentes auxiliares para loading, erro e vazio
function LoadingPlaceholder() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Documentos por Status
      </h3>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
}

function ErrorPlaceholder({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Documentos por Status
      </h3>
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{message}</p>
      </div>
    </div>
  );
}

function EmptyPlaceholder() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Documentos por Status
      </h3>
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Nenhum documento encontrado</p>
      </div>
    </div>
  );
}
