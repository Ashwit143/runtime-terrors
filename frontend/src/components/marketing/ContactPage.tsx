import React, { useState } from 'react';
import { Mail, MapPin, Phone, CheckCircle2 } from 'lucide-react';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-container">
          <div>
            <p className="label-caps">Inquiries & Partnerships</p>
            <h1 className="page-header-title">Contact Industrial Operations</h1>
            <p className="page-header-desc">
              Connect with the Waste 2 Worth engineering team to register custom by-product streams or integrate industrial facility data.
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Contact Form */}
        <div className="card-soft" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
            Send an Inquiry
          </h2>

          {submitted ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
              <CheckCircle2 size={40} style={{ color: 'var(--primary)', margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy)' }}>
                Message Dispatched
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                Thank you. Our industrial circularity desk will review your material parameters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', company: '', message: '' });
                }}
                className="btn-header-login"
                style={{ marginTop: '1rem' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="label-caps" style={{ marginBottom: '0.375rem' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="label-caps" style={{ marginBottom: '0.375rem' }}>Work Email *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="e.g. rajesh@plant.co.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="label-caps" style={{ marginBottom: '0.375rem' }}>Enterprise / Plant Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Western Alloy Castings Ltd."
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label className="label-caps" style={{ marginBottom: '0.375rem' }}>Stream Specifications & Details *</label>
                <textarea
                  required
                  className="form-textarea"
                  placeholder="Which material by-products do you generate or wish to substitute into your manufacturing process?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  alignSelf: 'flex-start',
                  marginTop: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                Submit Inquiry
              </button>
            </form>
          )}
        </div>

        {/* Office Details & Desks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            {
              icon: Mail,
              label: 'Operations & Engineering Desk',
              val: 'ops@waste2worth.example',
              desc: 'For technical integration and batch stream onboarding',
            },
            {
              icon: Phone,
              label: 'Direct Support Line',
              val: '+91 20 4000 1200',
              desc: 'Monday to Friday, 9:00 AM – 6:00 PM IST',
            },
            {
              icon: MapPin,
              label: 'Industrial Coordination Center',
              val: 'Pune Industrial Cluster, Maharashtra, India',
              desc: 'Serving Maharashtra, Gujarat, Punjab, and Tamil Nadu industrial corridors',
            },
          ].map(({ icon: Icon, label, val, desc }) => (
            <div key={label} className="card-soft" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-blue)' }}>
                <Icon size={16} />
                <span className="label-caps" style={{ color: 'var(--brand-blue)' }}>{label}</span>
              </div>
              <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--navy)', marginTop: '0.375rem' }}>
                {val}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
