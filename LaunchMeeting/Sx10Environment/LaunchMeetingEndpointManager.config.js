module.exports = {
  apps : [
    {
    name: 'Sx10 Name',
    script: '{Endpoint_IP}.js',
    restart_delay: 2000 //in milliseconds
  },
    {
    name: 'Sx10 Name 2',
    script: '{Endpoint_IP_2}.js',
    restart_delay: 2000 //in milliseconds
  },
  ],
};
