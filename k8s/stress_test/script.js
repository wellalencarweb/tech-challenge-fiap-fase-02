import http from 'k6/http';
import { sleep } from 'k6';


const URL = '127.0.0.1:55421'; // Se LOAD_BALANCER_IP não estiver definido, use 'localhost'

export const options = {
  vus: 4000,
  duration: '30s',
};

export default function() {
  http.get(`http://${URL}/api/health`);
  sleep(1);
}
