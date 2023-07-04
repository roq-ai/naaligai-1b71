import axios from 'axios';
import queryString from 'query-string';
import { TimeInterface, TimeGetQueryInterface } from 'interfaces/time';
import { GetQueryInterface } from '../../interfaces';

export const getTimes = async (query?: TimeGetQueryInterface) => {
  const response = await axios.get(`/api/times${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTime = async (time: TimeInterface) => {
  const response = await axios.post('/api/times', time);
  return response.data;
};

export const updateTimeById = async (id: string, time: TimeInterface) => {
  const response = await axios.put(`/api/times/${id}`, time);
  return response.data;
};

export const getTimeById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/times/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTimeById = async (id: string) => {
  const response = await axios.delete(`/api/times/${id}`);
  return response.data;
};
