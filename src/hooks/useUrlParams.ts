import { useState, useEffect } from 'react';

interface PhotoParams {
  studentId?: number;
  photoIndex?: number;
  isDirectView?: boolean;
}

export const useUrlParams = () => {
  const [params, setParams] = useState<PhotoParams>({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('student');
    const photoIndex = urlParams.get('photo');
    const view = urlParams.get('view');

    setParams({
      studentId: studentId ? parseInt(studentId, 10) : undefined,
      photoIndex: photoIndex ? parseInt(photoIndex, 10) : undefined,
      isDirectView: view === 'direct'
    });
  }, []);

  const updateUrl = (studentId: number, photoIndex: number, directView: boolean = false) => {
    const url = new URL(window.location.href);
    url.searchParams.set('student', studentId.toString());
    url.searchParams.set('photo', photoIndex.toString());
    
    if (directView) {
      url.searchParams.set('view', 'direct');
    } else {
      url.searchParams.delete('view');
    }

    window.history.pushState({}, '', url.toString());
  };

  const clearParams = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('student');
    url.searchParams.delete('photo');
    url.searchParams.delete('view');
    window.history.pushState({}, '', url.toString());
  };

  const generateShareUrl = (studentId: number, photoIndex: number, directView: boolean = false) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('student', studentId.toString());
    params.set('photo', photoIndex.toString());
    
    if (directView) {
      params.set('view', 'direct');
    }

    return `${baseUrl}?${params.toString()}`;
  };

  return {
    params,
    updateUrl,
    clearParams,
    generateShareUrl
  };
};