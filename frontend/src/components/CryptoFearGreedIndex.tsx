import React, { useEffect, useState, useRef } from 'react';
import fearAndGreedService, { FearAndGreedData } from '../services/fearAndGreedService';
import { Chart, ChartData, ChartOptions } from 'chart.js';

const CryptoFearGreedIndex: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<FearAndGreedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fearAndGreedService.getCurrentIndex();
        setCurrentIndex(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch Fear and Greed Index data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && currentIndex && chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create gradient for the chart
      const ctx = chartRef.current.getContext('2d');
      let gradient = null;
      if (ctx) {
        gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.1)'); // Red for fear
        gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.1)'); // Yellow for neutral
        gradient.addColorStop(1, 'rgba(0, 255, 0, 0.1)'); // Green for greed
      }

      const getColorForValue = (value: number): string => {
        if (value <= 20) return '#FF0000'; // Extreme Fear - Red
        if (value <= 40) return '#FF8C00'; // Fear - Orange
        if (value <= 60) return '#FFFF00'; // Neutral - Yellow
        if (value <= 80) return '#9ACD32'; // Greed - YellowGreen
        return '#008000'; // Extreme Greed - Green
      };

      const chartData: ChartData<'doughnut'> = {
        labels: ['Fear & Greed Index'],
        datasets: [{
          data: [currentIndex.value, 100 - currentIndex.value],
          backgroundColor: [
            getColorForValue(currentIndex.value),
            'rgba(200, 200, 200, 0.1)'
          ],
          borderWidth: 0
        }]
      };

      const chartOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '80%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        }
      };

      // Initialize the chart
      chartInstance.current = new Chart(chartRef.current, {
        type: 'doughnut',
        data: chartData,
        options: chartOptions
      });
    }
  }, [loading, currentIndex]);

  const getClassColor = (classification: string) => {
    switch (classification) {
      case 'Extreme Fear':
        return 'text-red-600';
      case 'Fear':
        return 'text-orange-500';
      case 'Neutral':
        return 'text-yellow-500';
      case 'Greed':
        return 'text-lime-500';
      case 'Extreme Greed':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex justify-center items-center h-64">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title">Crypto Fear & Greed Index</h5>
      </div>
      <div className="card-body">
        {currentIndex && (
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 mb-4">
              <canvas ref={chartRef}></canvas>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold">{currentIndex.value}</div>
                  <div className={`text-xl font-semibold ${getClassColor(currentIndex.classification)}`}>
                    {currentIndex.classification}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date(currentIndex.timestamp).toLocaleString()}
            </div>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-600">
          <p>The Fear & Greed Index analyzes emotions and sentiments from different sources and represents them in a simple number. The index ranges from 0 to 100, where 0 represents "Extreme Fear" and 100 represents "Extreme Greed".</p>
        </div>
      </div>
    </div>
  );
};

export default CryptoFearGreedIndex; 