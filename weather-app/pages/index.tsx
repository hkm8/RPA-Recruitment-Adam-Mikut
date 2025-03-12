import { useEffect, useState } from 'react';
import { fetchReports, deleteReport, updateReport } from '../utils/api';
import { WeatherReport } from '../types/weather';
import styles from '../styles/Home.module.css';
import WeatherList from '../components/WeatherList';

export default function Home() {
  const [reports, setReports] = useState<WeatherReport[]>([]);

  const fetchAndSetReports = async () => {
    const reports = await fetchReports();
    setReports(reports);
  };

  useEffect(() => {
    fetchAndSetReports();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteReport(id);
    setReports(reports.filter(report => report.id !== id));
  };

  const handleUpdate = async (updatedReport: WeatherReport) => {
    if (updatedReport.id) {
      await updateReport(updatedReport.id, updatedReport);
    }
    setReports(prevReports => {

      const filteredReports = prevReports.filter(report => report.id !== updatedReport.id);

      return [...filteredReports, updatedReport];
    });
  };

  return (
    <div className={`${styles.container} `}>
      <h1 className={styles.title}>Weather Reports</h1>
     
      <WeatherList reports={reports} handleDelete={handleDelete} handleUpdate={handleUpdate} />
    </div>
  );
}
