import NodeCache from 'node-cache';

export const cache = new NodeCache({ checkperiod: 120 });

export default cache;
