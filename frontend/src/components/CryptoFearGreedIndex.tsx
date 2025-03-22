import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import fearAndGreedService, { FearAndGreedData } from '../services/fearAndGreedService';
import { ApexOptions } from 'apexcharts';

const CryptoFearGreedIndex: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<FearAndGreedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const getColorForValue = (value: number): string => {
    if (value <= 20) return '#FF0000'; // Extreme Fear - Red
    if (value <= 40) return '#FF8C00'; // Fear - Orange
    if (value <= 60) return '#FFFF00'; // Neutral - Yellow
    if (value <= 80) return '#9ACD32'; // Greed - YellowGreen
    if (value <= 100) return '#008000'; // Extreme Greed - Green
    return '#008000'; // Extreme Greed - Green
  };


  const chartOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 220,
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -130,
        endAngle: 130,
        hollow: {
          margin: 0,
          size: '50%',
          background: 'transparent',
        },
        track: {
          strokeWidth: '80%',
          background: 'rgba(0, 0, 0, 0.1)',
        },
        dataLabels: {
          name: {
            fontSize: '14px',
            color: 'var(--base-content)',
            offsetY: 0
          },
          value: {
            offsetY: 0,
            fontSize: '20px',
            color: 'var(--base-content)',
            formatter: function (val: number) {
              return val + '%';
            }
          }
        }
      }
    },
    fill: {
      type: 'solid',
      opacity: 1,
    },
    stroke: {
      dashArray: 4,
      lineCap: 'round'
    },
    labels: [''],
    colors: [currentIndex ? getColorForValue(currentIndex.value) : '#000000'],
  };

  if (loading) {
    return (
      <div className="card glass bg-orange-200">
        <div className="card-body">
          <h2 className="text-base-content/50 mb-2">Crypto Fear & Greed Index</h2>
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="relative w-full max-w-[200px] rounded-2xl overflow-hidden">
              <div className="flex justify-center items-center h-[180px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm text-base-content/70">
                Loading...
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-base-content/70">
                <p>The Fear & Greed Index analyzes emotions and sentiments from different sources and represents them in a simple number. The index ranges from 0 to 100, where 0 represents "Extreme Fear" and 100 represents "Extreme Greed".</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card glass bg-orange-200">
      <div className="card-body">
        <h2 className="text-base-content/50 mb-2">Crypto Fear & Greed Index</h2>
        {currentIndex && (
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="relative w-full max-w-[200px] rounded-2xl overflow-hidden">
              <div className="relative">
                <ReactApexChart
                  options={chartOptions}
                  series={[currentIndex.value]}
                  type="radialBar"
                  height={180}
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm text-base-content/70">
                Current Status
              </div>
              <div className={`text-xl font-bold`}>
                {currentIndex.value_classification}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-base-content/70">
                <p>The Fear & Greed Index analyzes emotions and sentiments from different sources and represents them in a simple number. The index ranges from 0 to 100, where 0 represents "Extreme Fear" and 100 represents "Extreme Greed".</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoFearGreedIndex; 