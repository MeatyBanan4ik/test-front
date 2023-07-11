import axios from 'axios';
import { BASE_API_URL } from '../constants/api.constants';

function AxiosProvider({ children }) {
	axios.defaults.baseURL = BASE_API_URL;

	axios.interceptors.response.use(({ data }) => data);

	return children;
}

export default AxiosProvider;
