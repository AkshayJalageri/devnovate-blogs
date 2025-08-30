import axios from 'axios';

// Set default base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:5000';

// Include credentials with every request
axios.defaults.withCredentials = true;