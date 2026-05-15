import axios from 'axios';
import React from 'react';

const useAxiosSecure = axios.create({
    baseURL: 'http://localhost:5173'
})
const useAxios = () => {
    return useAxiosSecure
};

export default useAxios;