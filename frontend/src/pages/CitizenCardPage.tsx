import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../config/api";

interface UserData {
  _id: string;
  ID: string;
  Aadhaar: string;
  FirstName: string;
  LastName: string;
  MotherName: string;
  FatherName: string;
  Sex: string;
  Birthday: string;
  Age: number;
  DistrictId: number;
  Phone: string;
  VoterId: string;
  DefPassword: string;
  State: string;
  LinkedCredentials?: Array<{
    credentialType: string;
    credentialValue: string;
    details?: string;
    linkedAt?: string;
    actor?: string;
  }>;
}

const Field: React.FC<{ label: string; value?: string | number }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col gap-0.5">
    <span
      style={{
        fontSize: "10px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#6b7280",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: "14px",
        fontWeight: 500,
        color: "#111827",
        wordBreak: "break-all",
      }}
    >
      {value ?? "—"}
    </span>
  </div>
);

const CitizenCardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("No citizen ID provided.");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        // Fetch citizen by UVID using the verified voters endpoint
        const res = await fetch(apiUrl(`/voters/${encodeURIComponent(id)}`));
        if (!res.ok) throw new Error("Citizen not found");
        const citizen = await res.json();
        if (!citizen) throw new Error("Citizen not found");
        setUserData(citizen);
      } catch (err: any) {
        setError(err.message || "Failed to load citizen data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const genderLabel = (s?: string) => {
    if (s === "M") return "Male";
    if (s === "F") return "Female";
    return s || "—";
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: "4px solid #e5e7eb",
              borderTopColor: "#000080",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            Loading citizen record…
          </p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: "40px 48px",
            textAlign: "center",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            maxWidth: 400,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#fee2e2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <span style={{ fontSize: 28 }}>⚠️</span>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
            Record Not Found
          </h2>
          <p style={{ fontSize: 14, color: "#6b7280" }}>
            {error || "The citizen record could not be located."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4ff 0%, #e8f5e9 100%)",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "32px 16px",
      }}
    >
      {/* India tricolor top bar */}
      <div
        style={{
          height: 5,
          background: "linear-gradient(to right, #FF9933 33%, #ffffff 33%, #ffffff 66%, #138808 66%)",
          borderRadius: "4px 4px 0 0",
          maxWidth: 760,
          margin: "0 auto",
        }}
      />

      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          background: "white",
          borderRadius: "0 0 16px 16px",
          boxShadow: "0 8px 40px rgba(0,0,128,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #000080 0%, #1a1a8f 100%)",
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              border: "3px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            {userData.FirstName?.[0]}
            {userData.LastName?.[0]}
          </div>

          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(255,255,255,0.6)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                margin: 0,
              }}
            >
              Government of India · CredChain
            </p>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "white",
                margin: "4px 0 2px",
                lineHeight: 1.2,
              }}
            >
              {userData.FirstName} {userData.LastName}
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0 }}>
              📍 {userData.State}, India
            </p>
          </div>

          <div
            style={{
              textAlign: "right",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.05em",
              }}
            >
              VERIFIED RECORD
            </span>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                margin: "8px 0 0",
                fontFamily: "monospace",
              }}
            >
              UVID: {userData.ID}
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "32px" }}>
          {/* Personal Information */}
          <div style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#000080",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 3,
                  height: 14,
                  background: "#FF9933",
                  borderRadius: 2,
                }}
              />
              Personal Information
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "18px 24px",
                background: "#f9fafb",
                borderRadius: 10,
                padding: "20px",
                border: "1px solid #e5e7eb",
              }}
            >
              <Field label="First Name" value={userData.FirstName} />
              <Field label="Last Name" value={userData.LastName} />
              <Field label="Father's Name" value={userData.FatherName} />
              <Field label="Mother's Name" value={userData.MotherName} />
              <Field label="Gender" value={genderLabel(userData.Sex)} />
              <Field label="Age" value={userData.Age} />
              <Field label="Date of Birth" value={userData.Birthday} />
              <Field label="State / UT" value={userData.State} />
              <Field label="District Code" value={userData.DistrictId} />
              <Field label="Phone" value={userData.Phone} />
            </div>
          </div>

          {/* Identity Proofs */}
          <div style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#000080",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 3,
                  height: 14,
                  background: "#138808",
                  borderRadius: 2,
                }}
              />
              Identity Proofs
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "18px 24px",
                background: "#f9fafb",
                borderRadius: 10,
                padding: "20px",
                border: "1px solid #e5e7eb",
              }}
            >
              <Field label="Aadhaar Number" value={userData.Aadhaar} />
              <Field label="EPIC / Voter ID" value={userData.VoterId} />
              <Field label="System ID (UVID)" value={userData.ID} />
            </div>
          </div>

          {/* Linked Credentials */}
          {userData.LinkedCredentials && userData.LinkedCredentials.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#000080",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 3,
                    height: 14,
                    background: "#000080",
                    borderRadius: 2,
                  }}
                />
                Linked Credentials
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {userData.LinkedCredentials.map((cred, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      background: "#f9fafb",
                      borderRadius: 8,
                      padding: "12px 16px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#000080",
                        background: "#dbeafe",
                        borderRadius: 4,
                        padding: "2px 8px",
                        flexShrink: 0,
                      }}
                    >
                      {cred.credentialType}
                    </span>
                    <span style={{ fontSize: 13, color: "#374151", fontFamily: "monospace" }}>
                      {cred.credentialValue}
                    </span>
                    {cred.linkedAt && (
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: 11,
                          color: "#9ca3af",
                        }}
                      >
                        {new Date(cred.linkedAt).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              marginTop: 8,
              paddingTop: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}
              >
                This is an official CredChain digital record.
              </p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>
                Verify authenticity at credchain.gov.in
              </p>
            </div>
            <div
              style={{
                height: 5,
                width: 60,
                background:
                  "linear-gradient(to right, #FF9933 33%, #ffffff 33%, #ffffff 66%, #138808 66%)",
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      </div>

      <p
        style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: 12,
          color: "#9ca3af",
        }}
      >
        © 2025 CredChain India · NIC/GOI · For official use only
      </p>
    </div>
  );
};

export default CitizenCardPage;
