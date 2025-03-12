import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { WeatherReport, TemperatureUnit } from '../types/weather';
import styles from '../styles/WeatherForm.module.css';

const convertToKelvin = (temp: number, unit: TemperatureUnit): number => {
  if (unit === 'C') return temp + 273.15;
  if (unit === 'F') return ((temp - 32) * 5) / 9 + 273.15;
  return temp; 
};


const convertFromKelvin = (kelvin: number, unit: TemperatureUnit): number => {
  if (unit === 'C') return kelvin - 273.15;
  if (unit === 'F') return ((kelvin - 273.15) * 9) / 5 + 32;
  return kelvin;
};

interface WeatherFormProps {
  onSubmit: (report: WeatherReport) => void;
  existingReports?: WeatherReport[];
}

const WeatherForm: React.FC<WeatherFormProps> = ({ onSubmit }) => {
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [date, setDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query.id) {
      setIsEditing(true);
      
      setCity(router.query.city as string);

      const kelvinTemp = parseFloat(router.query.temperature as string);
      
      const convertedTemp = convertFromKelvin(kelvinTemp, unit);
      setTemperature(convertedTemp.toFixed(2));
      
      setDate(router.query.date as string);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [router.query, unit]);

  const handleUnitChange = (newUnit: TemperatureUnit) => {
    if (temperature && unit !== newUnit) {
      const kelvin = convertToKelvin(parseFloat(temperature), unit);
      
      const convertedTemp = convertFromKelvin(kelvin, newUnit);
      
      setTemperature(convertedTemp.toFixed(2));
      setUnit(newUnit);
    } else {
      setUnit(newUnit);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const tempValue = parseFloat(temperature);
    if (isNaN(tempValue)) {
      alert('Please enter a valid temperature!');
      return;
    }

    const newReport: WeatherReport = {
      id: router.query.id ? router.query.id as string : Date.now().toString(),
      city,
      temperature: convertToKelvin(tempValue, unit),
      unit: 'K', 
      date,
    };

    try {
      onSubmit(newReport);
      router.push('/');
    } catch (error) {
      console.error('Failed to submit report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{isEditing ? 'Edit Weather Report' : 'Add Weather Report'}</h1>
      <form onSubmit={handleSubmit} className={styles.verticalForm}>
        <label>
          City
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          Temperature
          <input
            type="number"
            step="1"
            placeholder="Temperature"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            required
          />
        </label>
        <div className={styles.unitButtons}>
          <button
            type="button"
            className={`${styles.unitButton} ${unit === 'C' ? styles.activeButton : ''}`}
            onClick={() => handleUnitChange('C')}
          >
            °C
          </button>
          <button
            type="button"
            className={`${styles.unitButton} ${unit === 'F' ? styles.activeButton : ''}`}
            onClick={() => handleUnitChange('F')}
          >
            °F
          </button>
          <button
            type="button"
            className={`${styles.unitButton} ${unit === 'K' ? styles.activeButton : ''}`}
            onClick={() => handleUnitChange('K')}
          >
            K
          </button>
        </div>
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={today}
            required
          />
        </label>
        <button type="submit" className={styles.submitButton}>
          {isEditing ? 'Update Report' : 'Add Report'}
        </button>
        <button 
          type="button" 
          onClick={() => router.push('/')}
          className={styles.backButton}
        >
          Back to Home
        </button>
      </form>
    </div>
  );
};

export default WeatherForm;