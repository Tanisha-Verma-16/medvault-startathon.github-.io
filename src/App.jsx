import React, { useState, useEffect } from 'react';
import { Calendar, Shield, Users, Lock, CheckCircle2, XCircle, Clock, FileText, Upload, Key, LogOut, Activity, Pill, UserCircle, QrCode, Home, X, Hospital, AlertCircle, ArrowRight } from 'lucide-react';

// ============================================================================
// STYLES (Inline for instant compatibility)
// ============================================================================

const styles = {
  // Layout
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
  },
  
  // Buttons
  btnPrimary: {
    background: 'linear-gradient(to right, #2563eb, #9333ea)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s',
  },
  
  btnSecondary: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s',
  },
  
  // Cards
  card: {
    background: 'white',
    borderRadius: '16px',
    border: '2px solid #e5e7eb',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '32px',
  },
  
  // Header
  header: {
    background: 'white',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  
  // Gradient card
  gradientCard: {
    background: 'linear-gradient(to right, #2563eb, #9333ea)',
    borderRadius: '24px',
    padding: '32px',
    color: 'white',
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
    marginBottom: '32px',
  },
};

// ============================================================================
// UTILITIES
// ============================================================================

const STORAGE_KEYS = {
  CURRENT_ROLE: 'medvault_current_role',
  CURRENT_USER: 'medvault_current_user',
  PATIENTS: 'medvault_patients',
  PRESCRIPTIONS: 'medvault_prescriptions',
  ACCESS_CODES: 'medvault_access_codes',
  MEDICAL_RECORDS: 'medvault_medical_records'
};

const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    const demoPatient = {
      id: 'patient_001',
      name: 'Priya Sharma',
      age: 34,
      bloodGroup: 'O+',
      email: 'priya.sharma@gmail.com',
      phone: '+91 98765 43210',
    };
    
    const demoPrescriptions = [
      {
        id: 'rx_001',
        patientId: 'patient_001',
        doctorName: 'Dr. Rajesh Verma',
        specialty: 'Dermatology',
        medication: 'Tretinoin Cream 0.025%',
        dosage: 'Apply thin layer once daily',
        duration: '3 months',
        date: '2026-01-15',
        status: 'valid',
        notes: 'For acne treatment. Avoid sun exposure.'
      },
      {
        id: 'rx_002',
        patientId: 'patient_001',
        doctorName: 'Dr. Anjali Desai',
        specialty: 'General Medicine',
        medication: 'Amoxicillin 500mg',
        dosage: 'Three times daily after meals',
        duration: '7 days',
        date: '2026-01-10',
        status: 'used',
        usedDate: '2026-01-11',
        notes: 'Complete full course even if symptoms improve.'
      },
      {
        id: 'rx_003',
        patientId: 'patient_001',
        doctorName: 'Dr. Vikram Reddy',
        specialty: 'Cardiology',
        medication: 'Atorvastatin 20mg',
        dosage: 'Once daily before bedtime',
        duration: '6 months',
        date: '2026-01-05',
        status: 'valid',
        notes: 'For cholesterol management.'
      }
    ];
    
    const demoRecords = [
      {
        id: 'rec_001',
        patientId: 'patient_001',
        name: 'Blood Test Report - Complete Panel.pdf',
        type: 'pdf',
        uploadDate: '2026-01-20',
        category: 'Lab Report',
        size: '2.4 MB'
      },
      {
        id: 'rec_002',
        patientId: 'patient_001',
        name: 'Chest X-Ray - January 2026.jpg',
        type: 'image',
        uploadDate: '2026-01-18',
        category: 'Imaging',
        size: '1.8 MB'
      },
      {
        id: 'rec_003',
        patientId: 'patient_001',
        name: 'ECG Report - Cardiac Assessment.pdf',
        type: 'pdf',
        uploadDate: '2026-01-12',
        category: 'Diagnostic',
        size: '890 KB'
      }
    ];
    
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify([demoPatient]));
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(demoPrescriptions));
    localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(demoRecords));
    localStorage.setItem(STORAGE_KEYS.ACCESS_CODES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, 'patient_001');
  }
};

const getStorageItem = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const generateQRCode = (text) => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <rect fill="white" width="200" height="200"/>
      <g fill="black">
        <rect x="20" y="20" width="40" height="40"/>
        <rect x="140" y="20" width="40" height="40"/>
        <rect x="20" y="140" width="40" height="40"/>
        <rect x="30" y="30" width="20" height="20" fill="white"/>
        <rect x="150" y="30" width="20" height="20" fill="white"/>
        <rect x="30" y="150" width="20" height="20" fill="white"/>
        ${Array.from(text).map((_, i) => {
          const x = 80 + (i % 5) * 8;
          const y = 80 + Math.floor(i / 5) * 8;
          return `<rect x="${x}" y="${y}" width="6" height="6"/>`;
        }).join('')}
        <text x="100" y="195" text-anchor="middle" font-size="12" font-family="monospace">${text}</text>
      </g>
    </svg>
  `)}`;
};

const simulateFileUpload = (file, onProgress) => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          resolve({
            id: 'rec_' + Date.now(),
            name: file.name || 'Uploaded Document.pdf',
            type: file.type || 'pdf',
            uploadDate: new Date().toISOString(),
            category: file.category || 'General',
            size: file.size || `${(Math.random() * 5 + 0.5).toFixed(1)} MB`
          });
        }, 500);
      }
      onProgress(Math.min(progress, 100));
    }, 300);
  });
};

const generateAccessCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'MV-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// ============================================================================
// PRESCRIPTION CARD
// ============================================================================

function PrescriptionCard({ prescription, onMarkUsed }) {
  const getStatusConfig = () => {
    if (prescription.status === 'used') {
      return {
        icon: <XCircle size={20} />,
        text: 'Already Used',
        color: '#dc2626',
        bg: '#fef2f2',
        border: '#fecaca'
      };
    }
    
    const prescriptionDate = new Date(prescription.date);
    const expiryDate = new Date(prescriptionDate);
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    if (new Date() > expiryDate) {
      return {
        icon: <Clock size={20} />,
        text: 'Expired',
        color: '#6b7280',
        bg: '#f9fafb',
        border: '#e5e7eb'
      };
    }
    
    return {
      icon: <CheckCircle2 size={20} />,
      text: 'Valid',
      color: '#059669',
      bg: '#ecfdf5',
      border: '#a7f3d0'
    };
  };
  
  const status = getStatusConfig();
  
  return (
    <div style={{
      background: 'white',
      border: `2px solid ${status.border}`,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Pill size={20} color="#2563eb" />
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>{prescription.id}</span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{prescription.medication}</h3>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: status.bg,
          color: status.color,
          borderRadius: '20px',
          fontWeight: 600,
          fontSize: '14px',
        }}>
          {status.icon}
          {status.text}
        </div>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <UserCircle size={16} color="#9ca3af" style={{ marginTop: '2px' }} />
          <div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{prescription.doctorName}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{prescription.specialty}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <Activity size={16} color="#9ca3af" style={{ marginTop: '2px' }} />
          <div>
            <p style={{ margin: 0, fontSize: '14px' }}><strong>Dosage:</strong> {prescription.dosage}</p>
            <p style={{ margin: 0, fontSize: '14px' }}><strong>Duration:</strong> {prescription.duration}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <Calendar size={16} color="#9ca3af" style={{ marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '14px' }}>
            Prescribed on {new Date(prescription.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
      
      {prescription.notes && (
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>
            <strong>Note:</strong> {prescription.notes}
          </p>
        </div>
      )}
      
      {prescription.status === 'valid' && onMarkUsed && (
        <button
          onClick={() => onMarkUsed(prescription.id)}
          style={{
            width: '100%',
            background: '#dc2626',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            marginTop: '16px',
          }}
        >
          Mark as Used (Pharmacy)
        </button>
      )}
    </div>
  );
}

// ============================================================================
// LANDING PAGE
// ============================================================================

function LandingPage({ onEnter }) {
  const [currentProblem, setCurrentProblem] = useState(0);
  
  const problems = [
    {
      icon: <Hospital size={32} />,
      title: "Fragmented Medical History",
      description: "Visit a dermatologist today, cardiologist tomorrow. Each doctor starts from zero.",
    },
    {
      icon: <Lock size={32} />,
      title: "Data Ownership Crisis",
      description: "Hospitals own YOUR data. Change hospitals? Your history stays behind.",
    },
    {
      icon: <Pill size={32} />,
      title: "Prescription Fraud",
      description: "Paper prescriptions reused multiple times. Regulated drugs abused.",
    },
    {
      icon: <FileText size={32} />,
      title: "Paper Waste Nightmare",
      description: "Physical files, reports, MRI films. Lost, damaged, or impossible to find.",
    }
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProblem((prev) => (prev + 1) % problems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a)',
      color: 'white',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={styles.container}>
        <div style={{ textAlign: 'center', maxWidth: '1024px', margin: '0 auto', paddingTop: '80px', paddingBottom: '128px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            padding: '12px 24px',
            marginBottom: '32px',
          }}>
            <Shield size={24} color="#60a5fa" />
            <span style={{ fontWeight: 700, fontSize: '20px' }}>MedVault</span>
          </div>
          
          <h1 style={{ fontSize: '72px', fontWeight: 700, marginBottom: '24px', lineHeight: 1.2 }}>
            Your Medical Records.
            <br />
            <span style={{
              background: 'linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Your Control.
            </span>
          </h1>
          
          <p style={{ fontSize: '24px', color: '#93c5fd', marginBottom: '48px', maxWidth: '768px', margin: '0 auto 48px' }}>
            End fragmented healthcare. Own your medical history. Stop prescription fraud.
            <br />
            <span style={{ color: 'white', fontWeight: 600 }}>All in one secure vault.</span>
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onEnter('patient')}
              style={{
                ...styles.btnPrimary,
                padding: '16px 32px',
                fontSize: '18px',
                boxShadow: '0 20px 25px rgba(37, 99, 235, 0.3)',
              }}
            >
              <Users size={24} />
              Enter as Patient
              <ArrowRight size={20} />
            </button>
            
            <button
              onClick={() => onEnter('doctor')}
              style={{
                ...styles.btnSecondary,
                padding: '16px 32px',
                fontSize: '18px',
              }}
            >
              <Hospital size={24} />
              Enter as Doctor
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '672px',
            margin: '0 auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(to bottom right, #ef4444, #f97316)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {problems[currentProblem].icon}
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
                  {problems[currentProblem].title}
                </h3>
                <p style={{ fontSize: '14px', color: '#93c5fd', margin: 0 }}>
                  {problems[currentProblem].description}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
              {problems.map((_, index) => (
                <div
                  key={index}
                  style={{
                    height: '4px',
                    borderRadius: '2px',
                    transition: 'all 0.5s',
                    width: index === currentProblem ? '48px' : '24px',
                    background: index === currentProblem ? '#60a5fa' : 'rgba(255, 255, 255, 0.2)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PATIENT DASHBOARD
// ============================================================================

function PatientDashboard({ patient, onSwitchRole, onBackToLanding }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [records, setRecords] = useState([]);
  const [accessCodes, setAccessCodes] = useState([]);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [newAccessCode, setNewAccessCode] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState('');
  
  useEffect(() => {
    loadPatientData();
  }, []);
  
  const loadPatientData = () => {
    const allPrescriptions = getStorageItem(STORAGE_KEYS.PRESCRIPTIONS);
    const patientPrescriptions = allPrescriptions.filter(p => p.patientId === patient.id);
    setPrescriptions(patientPrescriptions);
    
    const allRecords = getStorageItem(STORAGE_KEYS.MEDICAL_RECORDS);
    const patientRecords = allRecords.filter(r => r.patientId === patient.id);
    setRecords(patientRecords);
    
    const allCodes = getStorageItem(STORAGE_KEYS.ACCESS_CODES);
    const activeCodes = allCodes.filter(c => c.patientId === patient.id && c.active);
    setAccessCodes(activeCodes);
  };
  
  const generateNewAccessCode = () => {
    const code = generateAccessCode();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);
    
    const newCode = {
      code,
      patientId: patient.id,
      createdAt: new Date().toISOString(),
      expiresAt: expiryDate.toISOString(),
      active: true
    };
    
    const allCodes = getStorageItem(STORAGE_KEYS.ACCESS_CODES);
    allCodes.push(newCode);
    setStorageItem(STORAGE_KEYS.ACCESS_CODES, allCodes);
    
    setNewAccessCode(code);
    setQrCodeData(generateQRCode(code));
    setShowAccessCode(true);
    loadPatientData();
  };
  
  const revokeAccess = (code) => {
    const allCodes = getStorageItem(STORAGE_KEYS.ACCESS_CODES);
    const updatedCodes = allCodes.map(c => 
      c.code === code ? { ...c, active: false } : c
    );
    setStorageItem(STORAGE_KEYS.ACCESS_CODES, updatedCodes);
    loadPatientData();
  };
  
  const handleFileUpload = async () => {
    const fileTypes = ['Blood Test', 'X-Ray', 'MRI Scan', 'CT Scan', 'ECG Report'];
    const randomType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    
    const mockFile = {
      name: `${randomType} - ${new Date().toLocaleDateString()}.pdf`,
      type: 'pdf',
      category: 'Lab Report',
      patientId: patient.id
    };
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadingFile(mockFile.name);
    
    try {
      const uploadedFile = await simulateFileUpload(mockFile, (progress) => {
        setUploadProgress(progress);
      });
      
      const allRecords = getStorageItem(STORAGE_KEYS.MEDICAL_RECORDS);
      allRecords.push(uploadedFile);
      setStorageItem(STORAGE_KEYS.MEDICAL_RECORDS, allRecords);
      
      loadPatientData();
      setIsUploading(false);
      setUploadProgress(0);
      setUploadingFile('');
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
    }
  };
  
  const markPrescriptionUsed = (prescriptionId) => {
    const allPrescriptions = getStorageItem(STORAGE_KEYS.PRESCRIPTIONS);
    const updatedPrescriptions = allPrescriptions.map(p =>
      p.id === prescriptionId 
        ? { ...p, status: 'used', usedDate: new Date().toISOString() }
        : p
    );
    setStorageItem(STORAGE_KEYS.PRESCRIPTIONS, updatedPrescriptions);
    loadPatientData();
  };
  
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #f3e8ff)' }}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ ...styles.container, padding: '16px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(to bottom right, #2563eb, #9333ea)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Shield size={28} color="white" />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>MedVault</h1>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Patient Portal</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={onBackToLanding}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                <Home size={16} />
                Home
              </button>
              <button
                onClick={onSwitchRole}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'linear-gradient(to right, #059669, #3b82f6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                <Users size={16} />
                Switch to Doctor
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ ...styles.container, paddingTop: '32px', paddingBottom: '32px' }}>
        {/* Patient Profile */}
        <div style={styles.gradientCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 700 }}>{patient.name}</h2>
              <div style={{ display: 'flex', gap: '24px', color: '#bfdbfe' }}>
                <span>Age: {patient.age}</span>
                <span>Blood Group: {patient.bloodGroup}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#bfdbfe', marginTop: '8px' }}>
                <span>{patient.email}</span>
                <span>{patient.phone}</span>
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(5px)',
              borderRadius: '16px',
              padding: '16px 24px',
            }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#bfdbfe' }}>Patient ID</p>
              <p style={{ margin: 0, fontSize: '18px', fontFamily: 'monospace', fontWeight: 700 }}>{patient.id}</p>
            </div>
          </div>
        </div>
        
        {/* Access Control */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={24} color="#2563eb" />
                Access Control
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Generate time-limited codes for doctors</p>
            </div>
            <button
              onClick={generateNewAccessCode}
              style={{
                ...styles.btnPrimary,
                boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)',
              }}
            >
              <QrCode size={20} />
              Generate Code
            </button>
          </div>
          
          {showAccessCode && (
            <div style={{
              background: 'linear-gradient(to right, #ecfdf5, #d1fae5)',
              border: '2px solid #6ee7b7',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              position: 'relative',
            }}>
              <button
                onClick={() => setShowAccessCode(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#059669',
                }}
              >
                <X size={20} />
              </button>
              
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, color: '#065f46' }}>
                ✅ New Access Code Generated!
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                <div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 600, color: '#065f46' }}>ACCESS CODE:</p>
                  <p style={{ margin: '0 0 12px 0', fontSize: '36px', fontFamily: 'monospace', fontWeight: 700, color: '#065f46' }}>
                    {newAccessCode}
                  </p>
                  <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#065f46' }}>Valid for 24 hours</p>
                  
                  <button
                    onClick={() => navigator.clipboard.writeText(newAccessCode)}
                    style={{
                      background: '#059669',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Copy Code
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 600, color: '#065f46' }}>SCAN QR CODE:</p>
                  <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <img src={qrCodeData} alt="QR Code" style={{ width: '192px', height: '192px' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {accessCodes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#374151' }}>Active Access Codes:</p>
              {accessCodes.map(code => (
                <div key={code.code} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <QrCode size={32} color="#2563eb" />
                    <div>
                      <p style={{ margin: 0, fontFamily: 'monospace', fontWeight: 700, fontSize: '18px' }}>{code.code}</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                        Expires {new Date(code.expiresAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => revokeAccess(code.code)}
                    style={{
                      color: '#dc2626',
                      background: 'none',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', background: '#f9fafb', borderRadius: '12px' }}>
              <Lock size={48} color="#d1d5db" style={{ marginBottom: '12px' }} />
              <p style={{ margin: 0, color: '#6b7280' }}>No active access codes</p>
            </div>
          )}
        </div>
        
        {/* Medical Records */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={24} color="#9333ea" />
              Medical Records
            </h3>
            <button
              onClick={handleFileUpload}
              disabled={isUploading}
              style={{
                background: '#9333ea',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isUploading ? 0.5 : 1,
              }}
            >
              <Upload size={20} />
              Upload Record
            </button>
          </div>
          
          {isUploading && (
            <div style={{
              background: '#eff6ff',
              border: '2px solid #93c5fd',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#2563eb',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Upload size={24} color="white" />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>Uploading...</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>{uploadingFile}</p>
                </div>
                <span style={{ fontSize: '28px', fontWeight: 700, color: '#2563eb' }}>{Math.round(uploadProgress)}%</span>
              </div>
              
              <div style={{
                position: 'relative',
                height: '12px',
                background: '#bfdbfe',
                borderRadius: '6px',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  background: 'linear-gradient(to right, #2563eb, #9333ea)',
                  borderRadius: '6px',
                  transition: 'width 0.3s',
                  width: `${uploadProgress}%`,
                }} />
              </div>
              
              {uploadProgress === 100 && (
                <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} />
                  Processing and securing your medical record...
                </p>
              )}
            </div>
          )}
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {records.map(record => (
              <div key={record.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: '#faf5ff',
                border: '1px solid #e9d5ff',
                borderRadius: '12px',
                padding: '16px',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#9333ea',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <FileText size={24} color="white" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {record.name}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                    {record.category} • {record.size}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {records.length === 0 && !isUploading && (
            <div style={{ textAlign: 'center', padding: '48px', background: '#f9fafb', borderRadius: '12px' }}>
              <FileText size={64} color="#d1d5db" style={{ marginBottom: '16px' }} />
              <p style={{ margin: 0, color: '#6b7280', fontWeight: 500 }}>No medical records yet</p>
            </div>
          )}
        </div>
        
        {/* Prescriptions */}
        <div style={styles.card}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Pill size={24} color="#2563eb" />
            Prescription History
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {prescriptions.map(prescription => (
              <PrescriptionCard 
                key={prescription.id}
                prescription={prescription}
                onMarkUsed={markPrescriptionUsed}
              />
            ))}
          </div>
          
          {prescriptions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', background: '#f9fafb', borderRadius: '12px' }}>
              <Pill size={64} color="#d1d5db" style={{ marginBottom: '16px' }} />
              <p style={{ margin: 0, color: '#6b7280', fontWeight: 500 }}>No prescriptions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DOCTOR DASHBOARD
// ============================================================================

function DoctorDashboard({ onSwitchRole, onBackToLanding }) {
  const [accessCode, setAccessCode] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showNewPrescription, setShowNewPrescription] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    medication: '',
    dosage: '',
    duration: '',
    notes: ''
  });
  
  const verifyAccessCode = async () => {
    setError('');
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const allCodes = getStorageItem(STORAGE_KEYS.ACCESS_CODES);
    const codeData = allCodes.find(c => c.code === accessCode && c.active);
    
    if (!codeData) {
      setError('Invalid or inactive access code');
      setIsVerifying(false);
      return;
    }
    
    if (new Date() > new Date(codeData.expiresAt)) {
      setError('Access code has expired');
      setIsVerifying(false);
      return;
    }
    
    const allPatients = getStorageItem(STORAGE_KEYS.PATIENTS);
    const patient = allPatients.find(p => p.id === codeData.patientId);
    
    const allPrescriptions = getStorageItem(STORAGE_KEYS.PRESCRIPTIONS);
    const patientPrescriptions = allPrescriptions.filter(p => p.patientId === codeData.patientId);
    
    const allRecords = getStorageItem(STORAGE_KEYS.MEDICAL_RECORDS);
    const patientRecords = allRecords.filter(r => r.patientId === codeData.patientId);
    
    setPatientData({
      patient,
      prescriptions: patientPrescriptions,
      records: patientRecords
    });
    setIsVerifying(false);
  };
  
  const addPrescription = async () => {
    if (!prescriptionForm.medication || !prescriptionForm.dosage || !prescriptionForm.duration) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newPrescription = {
      id: 'rx_' + Date.now(),
      patientId: patientData.patient.id,
      doctorName: 'Dr. Arjun Mehta',
      specialty: 'General Medicine',
      medication: prescriptionForm.medication,
      dosage: prescriptionForm.dosage,
      duration: prescriptionForm.duration,
      date: new Date().toISOString().split('T')[0],
      status: 'valid',
      notes: prescriptionForm.notes
    };
    
    const allPrescriptions = getStorageItem(STORAGE_KEYS.PRESCRIPTIONS);
    allPrescriptions.push(newPrescription);
    setStorageItem(STORAGE_KEYS.PRESCRIPTIONS, allPrescriptions);
    
    const patientPrescriptions = allPrescriptions.filter(p => p.patientId === patientData.patient.id);
    setPatientData({
      ...patientData,
      prescriptions: patientPrescriptions
    });
    
    setPrescriptionForm({ medication: '', dosage: '', duration: '', notes: '' });
    setShowNewPrescription(false);
    setIsSaving(false);
  };
  
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ecfdf5, #ffffff, #eff6ff)' }}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ ...styles.container, padding: '16px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(to bottom right, #059669, #3b82f6)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Shield size={28} color="white" />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>MedVault</h1>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Doctor Portal</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={onBackToLanding}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                <Home size={16} />
                Home
              </button>
              <button
                onClick={onSwitchRole}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'linear-gradient(to right, #2563eb, #9333ea)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                <Users size={16} />
                Switch to Patient
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ ...styles.container, paddingTop: '32px', paddingBottom: '32px' }}>
        {!patientData ? (
          <div style={{ maxWidth: '448px', margin: '80px auto 0' }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              border: '2px solid #e5e7eb',
              padding: '32px',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(to bottom right, #059669, #3b82f6)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <Key size={32} color="white" />
              </div>
              
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, textAlign: 'center' }}>
                Enter Access Code
              </h2>
              <p style={{ margin: '0 0 24px 0', color: '#6b7280', textAlign: 'center' }}>
                Request code from patient to view records
              </p>
              
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="MV-XXXXXX"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #d1d5db',
                  borderRadius: '12px',
                  fontFamily: 'monospace',
                  fontSize: '18px',
                  textAlign: 'center',
                  marginBottom: '16px',
                  boxSizing: 'border-box',
                }}
                disabled={isVerifying}
              />
              
              {error && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <AlertCircle size={20} color="#dc2626" />
                  <p style={{ margin: 0, fontSize: '14px', color: '#991b1b' }}>{error}</p>
                </div>
              )}
              
              <button
                onClick={verifyAccessCode}
                disabled={isVerifying || !accessCode}
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #059669, #3b82f6)',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: isVerifying || !accessCode ? 'not-allowed' : 'pointer',
                  opacity: isVerifying || !accessCode ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 6px rgba(5, 150, 105, 0.3)',
                }}
              >
                {isVerifying ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
                    Verifying...
                  </>
                ) : (
                  'Verify & Access Records'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Patient Info */}
            <div style={{
              ...styles.gradientCard,
              background: 'linear-gradient(to right, #059669, #3b82f6)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 700 }}>{patientData.patient.name}</h2>
                  <div style={{ display: 'flex', gap: '24px', color: '#d1fae5' }}>
                    <span>Age: {patientData.patient.age}</span>
                    <span>Blood Group: {patientData.patient.bloodGroup}</span>
                  </div>
                </div>
                <button
                  onClick={() => setPatientData(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(5px)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 500,
                  }}
                >
                  <LogOut size={16} />
                  Exit
                </button>
              </div>
            </div>
            
            {/* Medical Records */}
            <div style={styles.card}>
              <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={24} color="#9333ea" />
                Medical Records
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {patientData.records.map(record => (
                  <div key={record.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    background: '#faf5ff',
                    border: '1px solid #e9d5ff',
                    borderRadius: '12px',
                    padding: '16px',
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: '#9333ea',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <FileText size={24} color="white" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {record.name}
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                        {record.category} • {record.size}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Prescriptions */}
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Pill size={24} color="#2563eb" />
                  Prescription History
                </h3>
                <button
                  onClick={() => setShowNewPrescription(!showNewPrescription)}
                  style={{
                    background: 'linear-gradient(to right, #059669, #3b82f6)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(5, 150, 105, 0.3)',
                  }}
                >
                  {showNewPrescription ? 'Cancel' : 'Add Prescription'}
                </button>
              </div>
              
              {showNewPrescription && (
                <div style={{
                  background: '#ecfdf5',
                  border: '2px solid #6ee7b7',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px',
                }}>
                  <h4 style={{ margin: '0 0 16px 0', fontWeight: 700 }}>New Prescription</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                        Medication *
                      </label>
                      <input
                        type="text"
                        value={prescriptionForm.medication}
                        onChange={(e) => setPrescriptionForm({...prescriptionForm, medication: e.target.value})}
                        placeholder="e.g., Amoxicillin 500mg"
                        style={{
                          width: '100%',
                          padding: '8px 16px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                        disabled={isSaving}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                        Dosage *
                      </label>
                      <input
                        type="text"
                        value={prescriptionForm.dosage}
                        onChange={(e) => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})}
                        placeholder="e.g., Three times daily"
                        style={{
                          width: '100%',
                          padding: '8px 16px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                        disabled={isSaving}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                        Duration *
                      </label>
                      <input
                        type="text"
                        value={prescriptionForm.duration}
                        onChange={(e) => setPrescriptionForm({...prescriptionForm, duration: e.target.value})}
                        placeholder="e.g., 7 days"
                        style={{
                          width: '100%',
                          padding: '8px 16px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                        disabled={isSaving}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                        Notes
                      </label>
                      <textarea
                        value={prescriptionForm.notes}
                        onChange={(e) => setPrescriptionForm({...prescriptionForm, notes: e.target.value})}
                        placeholder="Additional instructions"
                        style={{
                          width: '100%',
                          padding: '8px 16px',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          height: '96px',
                          resize: 'none',
                          boxSizing: 'border-box',
                        }}
                        disabled={isSaving}
                      />
                    </div>
                    
                    <button
                      onClick={addPrescription}
                      disabled={isSaving}
                      style={{
                        width: '100%',
                        background: '#059669',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        opacity: isSaving ? 0.5 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      {isSaving ? (
                        <>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            border: '2px solid white',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                          }} />
                          Creating...
                        </>
                      ) : (
                        'Create Prescription'
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                {patientData.prescriptions.map(prescription => (
                  <PrescriptionCard key={prescription.id} prescription={prescription} />
                ))}
              </div>
              
              {patientData.prescriptions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', background: '#f9fafb', borderRadius: '12px' }}>
                  <Pill size={64} color="#d1d5db" style={{ marginBottom: '16px' }} />
                  <p style={{ margin: 0, color: '#6b7280', fontWeight: 500 }}>No prescriptions on record</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

export default function MedVaultApp() {
  const [currentView, setCurrentView] = useState('landing');
  const [currentRole, setCurrentRole] = useState('patient');
  const [patient, setPatient] = useState(null);
  
  useEffect(() => {
    initializeData();
    
    const savedRole = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) || 'patient';
    setCurrentRole(savedRole);
    
    const currentUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const allPatients = getStorageItem(STORAGE_KEYS.PATIENTS);
    const currentPatient = allPatients.find(p => p.id === currentUserId);
    setPatient(currentPatient);
  }, []);
  
  const enterApp = (role) => {
    setCurrentRole(role);
    setCurrentView(role);
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
  };
  
  const switchRole = () => {
    const newRole = currentRole === 'patient' ? 'doctor' : 'patient';
    setCurrentRole(newRole);
    setCurrentView(newRole);
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, newRole);
  };
  
  const goToLanding = () => {
    setCurrentView('landing');
  };
  
  if (currentView === 'landing') {
    return <LandingPage onEnter={enterApp} />;
  }
  
  if (!patient) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom right, #eff6ff, #f3e8ff)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid #2563eb',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{ color: '#6b7280', fontWeight: 500 }}>Loading MedVault...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      {currentView === 'patient' ? (
        <PatientDashboard 
          patient={patient} 
          onSwitchRole={switchRole}
          onBackToLanding={goToLanding}
        />
      ) : (
        <DoctorDashboard 
          onSwitchRole={switchRole}
          onBackToLanding={goToLanding}
        />
      )}
    </div>
  );
}