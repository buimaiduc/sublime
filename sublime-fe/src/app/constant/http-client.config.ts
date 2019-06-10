import {environment} from '../../environments/environment';

const getApiUrl = () => {

  // return API_INFO['test'];
  return environment.APIEndpoint;
};

export {
  getApiUrl
};

