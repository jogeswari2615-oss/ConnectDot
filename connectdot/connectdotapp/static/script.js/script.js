import axios from 'axios';

const handleApply = async (jobData) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/apply-job/', {
      job_title: jobData.title,
      company: jobData.company,
      location_type: jobData.isAbroad ? 'Abroad' : 'India'
    });
    alert(response.data.message);
  } catch (error) {
    console.error("Error applying:", error);
  }
};