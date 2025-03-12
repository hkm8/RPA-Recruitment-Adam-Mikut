import axios from 'axios';
import { WeatherReport } from '../types/weather';

const API_URL = 'http://localhost:8000/api/reports';

export const fetchReports = async (): Promise<WeatherReport[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw new Error('Failed to fetch reports');
  }
};

export const deleteReport = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting report:', error);
    throw new Error('Failed to delete report');
  }
};

export const updateReport = async (id: string, report: WeatherReport): Promise<WeatherReport> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, report, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating report:', error);
    throw new Error('Failed to update report');
  }
};

export const addReport = async (report: WeatherReport): Promise<WeatherReport> => {
  try {
    const response = await axios.post(API_URL, report, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding report:', error);
    throw new Error('Failed to add report');
  }
};

export const getReportById = async (id: string): Promise<WeatherReport> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report by ID:', error);
    throw new Error('Failed to fetch report by ID');
  }
};