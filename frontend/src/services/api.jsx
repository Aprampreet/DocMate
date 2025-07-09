const BASE_URL = "http://localhost:8000/api";


export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data;
}

export async function registerUser(payload) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data;
}


export async function userProfile() {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch profile");
  return await res.json();
}

export async function updateUserProfile(formData) {
  const token = localStorage.getItem("access_token");  
  const form = new FormData();

  for (const key in formData) {
    if (formData[key]) form.append(key, formData[key]);
  }

  const res = await fetch(`${BASE_URL}/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!res.ok) throw new Error("Failed to update profile");
  return await res.json();
}


export async function FetchDoctorsList() {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${BASE_URL}/doctor/list`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch doctors");
  return await res.json();
}

export async function fetchDoctorDetail(id) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${BASE_URL}/doctor/detail/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch doctor detail");
  return await res.json();
}


export async function fetchDoctorProfile() {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${BASE_URL}/doctor/doctor_profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to fetch doctor profile");
  }

  return res.json();
}


export async function updateDoctorAvalibality(availabilities) {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${BASE_URL}/doctor/update_availabilities`,{
    method:'PUT',
    headers:{
      Authorization:`Bearer ${token}`,
      'Content-Type':'application/json',
    },
    body:JSON.stringify(availabilities),
  })
  if(!res.ok){
    const errorData = await res.json()
    throw new Error(errorData.detail || "Failed to update availabilities")
  }
  return await res.json()
}


export async function updateDoctorProfile(data,profile_pic) {
  const token = localStorage.getItem('access_token')
  const form = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      form.append(key, value)
    }
  })
  if (profile_pic) {
    form.append("doctor_profile_pic", profile_pic)
  }

  const res = await fetch(`${BASE_URL}/doctor/profile/update`,{
    method:'PUT',
    headers:{
      Authorization:`bearer ${token}`
      
    },
    body: form,
  })
  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.detail || "Failed to update doctor profile")
  }

  return await res.json()
  
}


export async function applyForDoctor(data,profilePic,licenseDoc) {
  const token = localStorage.getItem('access_token')
  const form = new FormData()

  Object.entries(data).forEach(([key,value])=>{
    if(key !== null && value !== null){
      form.append(key,value)
    }
  })

  if (profilePic) form.append('doctor_profile_pic',profilePic)
  if (licenseDoc) form.append('license_document',licenseDoc)
  
  const res = await fetch(`${BASE_URL}/doctor/apply`,{
    method: 'POST',
    headers:{
      Authorization:`Bearer ${token}`
    },
    body:form,
  })
  if(!res.ok){
     const errorData = await res.json()
    throw new Error(errorData.detail || errorData.error || "Application failed")
  }
  return await res.json()
  
}


export async function bookAppointment(data) {
  const token = localStorage.getItem('access_token')

  const res = await fetch(`${BASE_URL}/appointment/book`,{
    method:'POST',
    headers:{
      Authorization:`Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body:JSON.stringify(data),
  });
  if(!res.ok){
    const err = await res.json();
    throw new Error(err.detail || "Failed to book appointment");
  }
  return await res.json()
  
}

export async function List_user_appointment(){
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${BASE_URL}/appointment/list`,{
    method:'GET',
    headers:{
      Authorization: `Bearer ${token}`
    }
  });
  if(!res.ok){
    const err = await res.json();
    throw new Error(err.detail || "Failed to fetch Appointments")
  }
  return await res.json();
}

export async function List_doctor_appointment() {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${BASE_URL}/appointment/doctor`,{
    method:'GET',
    headers:{
      Authorization: `Bearer ${token}`
    }
  });
  if(!res.ok){
    const err = await res.json();
    throw new Error(err.detail || "Failed to fetch Appointments")
  }
  return await res.json();

  
}
export async function updateAppointmentStatus(appointmentId, status) {
  const token = localStorage.getItem('access_token')
  const response = await fetch(
    `${BASE_URL}/appointment/${appointmentId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update status");
  }

  return data;
}

export async function uploadReportScan(imageFile) {
    const token = localStorage.getItem('access_token')
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await fetch(`${BASE_URL}/appointment/report-scan`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to scan report.");
  }

  return await response.json();

}


export async function getDoctorsBySpecialization(specialization) {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    `${BASE_URL}/appointment/doctors-by-specialization?specialization=${encodeURIComponent(specialization)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch doctors: ${error}`);
  }

  return await response.json(); 
}


export async function submitDoctorReview(data, token) {
  const response = await fetch(`${BASE_URL}/appointment/submit-review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to submit review");
  }

  return await response.json();
}


export async function getDoctorReviews(doctorId, token) {
  const response = await fetch(`${BASE_URL}/appointment/doctor-reviews/${doctorId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch doctor reviews");
  }

  return await response.json(); 
}