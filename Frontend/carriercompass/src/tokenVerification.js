export const verifyToken = async (token) => {
  if (!token) {
    return { isValid: false, message: "No token found" };
  }

  try {
    const response = await fetch('http://localhost:8000/user/verify-token/{token}', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,

      },
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    return { isValid: true, message: "Token is valid" };
  } catch (error) {
    return { isValid: false, message: error.message };
  }
};

