export const apiConnector = async (method, url, data = null) => {
  const response = await fetch(url, {
      method,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
      },
      body: data ? JSON.stringify(data) : null,
  });
  
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  
  return await response.json();
};
