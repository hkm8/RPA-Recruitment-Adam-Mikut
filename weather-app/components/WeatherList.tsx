import { useState } from 'react';
import { WeatherReport } from '../types/weather';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/WeatherList.module.css';

interface WeatherListProps {
  reports: WeatherReport[];
  handleDelete: (id: string) => void;
  handleUpdate: (report: WeatherReport) => void;
}

const WeatherList: React.FC<WeatherListProps> = ({ reports, handleDelete }) => {
  const [sortKey, setSortKey] = useState<'temperature' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterCity, setFilterCity] = useState('');
  const router = useRouter();

  const uniqueCities = Array.from(new Set(reports.map(report => report.city)));

  const filteredReports = reports.filter(report =>
    filterCity ? report.city.toLowerCase().includes(filterCity.toLowerCase()) : true
  );

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleEdit = (report: WeatherReport) => {
    router.push({
      pathname: '/report',
      query: { id: report.id, city: report.city, temperature: report.temperature, date: report.date }
    });
  };

  const handleDeleteWithConfirmation = (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      handleDelete(id);
    }
  };

  return (
    <div>
      <div className={styles.controls}>
        <div className={styles.leftControls}>
          <label>Filter by city: </label>
          <input
            list="cities"
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
            placeholder="Type or select a city"
            autoComplete="on"
            className={styles.input}
          />
          <datalist id="cities">
            {uniqueCities.map(city => (
              <option key={city} value={city} />
            ))}
          </datalist>
          <button onClick={() => setFilterCity('')} className={`${styles.button} ${styles.clearButton}`}>Clear Filter</button>
          <label>Sort by: </label>
          <select onChange={e => setSortKey(e.target.value as 'temperature' | 'date')} className={styles.select}>
            <option value="date">Date</option>
            <option value="temperature">Temperature</option>
          </select>
          <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className={`${styles.button} ${styles.sortButton}`}>
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
        <Link href="/report" className={`${styles.button} ${styles.addButton}`}>Add New Report</Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>City</th>
            <th>Temperature (K)</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedReports.map((report, index) => (
            <tr
              key={report.id}
              className={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
            >
              <td>{report.city}</td>
              <td>{report.temperature}K</td>
              <td>{report.date}</td>
              <td>
                <button onClick={() => handleEdit(report)} className={styles.editButton}>Edit</button>
                <button onClick={() => handleDeleteWithConfirmation(report.id)} className={styles.deleteButton}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherList;