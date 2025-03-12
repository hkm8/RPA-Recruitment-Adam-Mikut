import { addReport, updateReport } from '../utils/api';
import { WeatherReport } from '../types/weather';
import WeatherForm from '../components/WeatherForm';
import { useRouter } from 'next/router';

export default function ReportForm() {
  const router = useRouter();

  const handleSubmit = async (report: WeatherReport) => {
    try {
      if (router.query.id) {
        await updateReport(report.id, report);
      } else {
        await addReport(report);
      }
      router.push('/');
    } catch (error) {
      console.error('Failed to submit report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  return (
    <div>
      <WeatherForm onSubmit={handleSubmit} />
    </div>
  );
}
