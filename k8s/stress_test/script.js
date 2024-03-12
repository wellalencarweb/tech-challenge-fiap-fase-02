import http from 'k6/http';
import { sleep } from 'k6';


const URL = 'http://localhost:6001'; // Caso use o Kubernets, coloque o endereço do LoadBalancer aqui ex.: '127.0.0.1:55421'

export const options = {
  vus: 4000,
  duration: '30s',
};

export default function() {
  http.get(`http://${URL}/api/health`);
  sleep(1);
}
