import { useContext } from 'react';
import StorageContext from '../contexts/storage.context';

export default function useStorage() {
	return useContext(StorageContext);
}
