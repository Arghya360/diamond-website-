'use client';

import { useState } from 'react';

const TABS = [
  { id: 'store', label: 'DIAMOND ENQUIRY' },
  { id: 'appointment', label: 'REQUEST A CONSULTATION' },
  { id: 'service', label: 'BESPOKE DESIGN' },
];

export default function ContactFormTabs() {
  const [activeTab, setActiveTab] = useState('store');
  const [submitted, setSubmitted] = useState(false);

  // Tab 1 state
  const [storeForm, setStoreForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    saveInfo: false,
  });

  // Tab 2 state
  const [apptForm, setApptForm] = useState({
    showroom: 'Private Consultation',
    name: '',
    email: '',
    phone: '',
    shoppingFor: '',
    preferredTime: '',
    shoppedPreviously: 'yes',
    salesAssociate: '',
    contactPreference: '',
    message: '',
    saveInfo: false,
  });

  // Tab 3 state
  const [serviceForm, setServiceForm] = useState({
    fullName: '',
    showroom: 'Private Consultation',
    phone: '',
    email: '',
    purchasedFromUs: 'yes',
    accountName: '',
    serviceDescription: '',
    saveInfo: false,
  });

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  }

  return (
    <div className="crysto-form-wrapper">
      <style>{`
        /* Reset any conflicting WordPress legacy styles inside this form */
        .crysto-form-wrapper * {
          box-sizing: border-box !important;
        }
        .crysto-form-wrapper input,
        .crysto-form-wrapper select,
        .crysto-form-wrapper textarea {
          float: none !important;
          box-shadow: none !important;
        }

        .crysto-tabs-bar {
          display: flex !important;
          align-items: flex-end !important;
          justify-content: center !important;
          border-bottom: 1.5px solid #111111 !important;
          margin-bottom: 40px !important;
          gap: 28px !important;
          flex-wrap: wrap !important;
          width: 100% !important;
        }

        .crysto-tab-btn {
          border: none !important;
          background: transparent !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          letter-spacing: 0.6px !important;
          text-transform: uppercase !important;
          cursor: pointer !important;
          padding: 13px 26px !important;
          color: #111111 !important;
          border-radius: 6px 6px 0 0 !important;
          margin-bottom: -1px !important;
          font-family: var(--title-fonts, "Readex Pro", sans-serif) !important;
          transition: all 0.2s ease !important;
        }

        .crysto-tab-btn.active {
          background-color: #000000 !important;
          color: #ffffff !important;
        }

        .crysto-grid-2 {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 22px 28px !important;
          margin-bottom: 22px !important;
          width: 100% !important;
          clear: both !important;
        }

        .crysto-grid-3 {
          display: grid !important;
          grid-template-columns: 1fr 1fr 1fr !important;
          gap: 22px 28px !important;
          margin-bottom: 22px !important;
          width: 100% !important;
          clear: both !important;
        }

        @media (max-width: 900px) {
          .crysto-grid-3 {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 650px) {
          .crysto-grid-2,
          .crysto-grid-3 {
            grid-template-columns: 1fr !important;
          }
          .crysto-tabs-bar {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 8px !important;
          }
          .crysto-tab-btn {
            border-radius: 6px !important;
            text-align: center !important;
          }
          .crysto-bottom-action-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
        }

        .crysto-label {
          display: block !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          color: #111111 !important;
          margin-bottom: 8px !important;
          font-family: var(--title-fonts, "Readex Pro", sans-serif) !important;
          line-height: 1.3 !important;
        }

        .crysto-input {
          width: 100% !important;
          float: none !important;
          display: block !important;
          height: 48px !important;
          padding: 10px 16px !important;
          font-size: 14px !important;
          color: #222222 !important;
          background-color: #fafafa !important;
          border: 1px solid #dcdcdc !important;
          border-radius: 6px !important;
          outline: none !important;
          box-sizing: border-box !important;
          font-family: inherit !important;
          line-height: 28px !important;
          transition: border-color 0.2s, background-color 0.2s !important;
        }

        .crysto-input:focus {
          border-color: #000000 !important;
          background-color: #ffffff !important;
        }

        .crysto-select {
          width: 100% !important;
          float: none !important;
          display: block !important;
          height: 48px !important;
          padding: 10px 16px !important;
          font-size: 14px !important;
          color: #222222 !important;
          background-color: #fafafa !important;
          border: 1px solid #dcdcdc !important;
          border-radius: 6px !important;
          outline: none !important;
          box-sizing: border-box !important;
          font-family: inherit !important;
          cursor: pointer !important;
        }

        .crysto-select:focus {
          border-color: #000000 !important;
          background-color: #ffffff !important;
        }

        .crysto-textarea-block {
          clear: both !important;
          margin-bottom: 24px !important;
          display: block !important;
          width: 100% !important;
        }

        .crysto-textarea {
          width: 100% !important;
          float: none !important;
          display: block !important;
          min-height: 160px !important;
          padding: 14px 16px !important;
          background-color: #fafafa !important;
          border: 1px solid #dcdcdc !important;
          border-radius: 6px !important;
          font-size: 14px !important;
          color: #222222 !important;
          outline: none !important;
          resize: vertical !important;
          line-height: 1.6 !important;
          box-sizing: border-box !important;
          font-family: inherit !important;
          transition: border-color 0.2s, background-color 0.2s !important;
        }

        .crysto-textarea:focus {
          border-color: #000000 !important;
          background-color: #ffffff !important;
        }

        .crysto-bottom-action-row {
          clear: both !important;
          display: flex !important;
          align-items: center !important;
          flex-wrap: wrap !important;
          gap: 24px !important;
          margin-top: 24px !important;
          width: 100% !important;
        }

        .crysto-submit-btn {
          float: none !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-color: #ff5400 !important;
          color: #ffffff !important;
          padding: 15px 32px !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          letter-spacing: 0.6px !important;
          text-transform: uppercase !important;
          border: none !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          flex-shrink: 0 !important;
          line-height: 1 !important;
          font-family: inherit !important;
          transition: background-color 0.2s ease !important;
        }

        .crysto-submit-btn:hover {
          background-color: #e04a00 !important;
        }

        .crysto-consent-label {
          display: inline-flex !important;
          align-items: center !important;
          gap: 10px !important;
          font-size: 13px !important;
          color: #666666 !important;
          cursor: pointer !important;
          margin: 0 !important;
          line-height: 1.5 !important;
        }

        .crysto-circle-checkbox {
          appearance: none !important;
          -webkit-appearance: none !important;
          width: 17px !important;
          height: 17px !important;
          border: 1.5px solid #b5b5b5 !important;
          border-radius: 50% !important;
          outline: none !important;
          cursor: pointer !important;
          display: inline-block !important;
          position: relative !important;
          flex-shrink: 0 !important;
          background-color: #ffffff !important;
          margin: 0 !important;
          padding: 0 !important;
          vertical-align: middle !important;
        }

        .crysto-circle-checkbox:checked {
          border-color: #ff5400 !important;
          background-color: #ff5400 !important;
        }

        .crysto-circle-checkbox:checked::after {
          content: "" !important;
          display: block !important;
          width: 7px !important;
          height: 7px !important;
          border-radius: 50% !important;
          background-color: #ffffff !important;
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
        }

        .crysto-radio-group {
          display: flex !important;
          gap: 24px !important;
          align-items: center !important;
          height: 48px !important;
        }

        .crysto-radio-label {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          cursor: pointer !important;
          font-size: 14px !important;
          color: #222222 !important;
          margin: 0 !important;
        }

        .crysto-radio-label input[type="radio"] {
          margin: 0 !important;
          width: 16px !important;
          height: 16px !important;
          accent-color: #0070f3 !important;
          cursor: pointer !important;
        }
      `}</style>

      {/* ── Tabs Navigation Bar ────────────────────────────────────── */}
      <div className="crysto-tabs-bar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`crysto-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: '6px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          Thank you for contacting Caritas Luxury. Your enquiry has been received. Our team will review your details and follow up with you.
        </div>
      )}

      {/* ── Tab 1: CONTACT OUR STORE ───────────────────────────────── */}
      {activeTab === 'store' && (
        <form onSubmit={handleSubmit}>
          <div className="crysto-grid-2">
            <div>
              <label className="crysto-label">Full name*</label>
              <input
                type="text"
                required
                className="crysto-input"
                placeholder="Enter your name"
                value={storeForm.fullName}
                onChange={(e) => setStoreForm({ ...storeForm, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="crysto-label">Email address*</label>
              <input
                type="email"
                required
                className="crysto-input"
                placeholder="Enter email address"
                value={storeForm.email}
                onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
              />
            </div>
          </div>

          <div className="crysto-grid-2">
            <div>
              <label className="crysto-label">Phone number*</label>
              <input
                type="tel"
                required
                className="crysto-input"
                placeholder="Enter phone number"
                value={storeForm.phone}
                onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="crysto-label">Subject</label>
              <input
                type="text"
                className="crysto-input"
                placeholder="Enter your subject"
                value={storeForm.subject}
                onChange={(e) => setStoreForm({ ...storeForm, subject: e.target.value })}
              />
            </div>
          </div>

          <div className="crysto-textarea-block">
            <label className="crysto-label">How can we help you?*</label>
            <textarea
              required
              className="crysto-textarea"
              placeholder="Type here..."
              value={storeForm.message}
              onChange={(e) => setStoreForm({ ...storeForm, message: e.target.value })}
            />
          </div>

          <div className="crysto-bottom-action-row">
            <button type="submit" className="crysto-submit-btn">
              SEND YOUR MESSAGE
            </button>
            <label className="crysto-consent-label">
              <input
                type="checkbox"
                className="crysto-circle-checkbox"
                checked={storeForm.saveInfo}
                onChange={(e) => setStoreForm({ ...storeForm, saveInfo: e.target.checked })}
              />
              <span>Save my name, email, and website in this browser for the next time I comment.</span>
            </label>
          </div>
        </form>
      )}

      {/* ── Tab 2: REQUEST AN APPOINTMENT ──────────────────────────── */}
      {activeTab === 'appointment' && (
        <form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div className="crysto-grid-3">
            <div>
              <label className="crysto-label">Select a Showroom *</label>
              <select
                required
                className="crysto-select"
                value={apptForm.showroom}
                onChange={(e) => setApptForm({ ...apptForm, showroom: e.target.value })}
              >
                <option value="Private Consultation">Private Consultation</option>
                <option value="New York, NY">New York, NY</option>
                <option value="Los Angeles, CA">Los Angeles, CA</option>
                <option value="Melbourne, Australia">Melbourne, Australia</option>
              </select>
            </div>
            <div>
              <label className="crysto-label">First &amp; Last name*</label>
              <input
                type="text"
                required
                className="crysto-input"
                placeholder="Enter your name"
                value={apptForm.name}
                onChange={(e) => setApptForm({ ...apptForm, name: e.target.value })}
              />
            </div>
            <div>
              <label className="crysto-label">Email address*</label>
              <input
                type="email"
                required
                className="crysto-input"
                placeholder="Enter email address"
                value={apptForm.email}
                onChange={(e) => setApptForm({ ...apptForm, email: e.target.value })}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="crysto-grid-3">
            <div>
              <label className="crysto-label">Phone number*</label>
              <input
                type="tel"
                required
                className="crysto-input"
                placeholder="Enter phone number"
                value={apptForm.phone}
                onChange={(e) => setApptForm({ ...apptForm, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="crysto-label">Which item(s) are you shopping for? *</label>
              <input
                type="text"
                required
                className="crysto-input"
                value={apptForm.shoppingFor}
                onChange={(e) => setApptForm({ ...apptForm, shoppingFor: e.target.value })}
              />
            </div>
            <div>
              <label className="crysto-label">Preferred appointment Day/Time</label>
              <input
                type="text"
                className="crysto-input"
                value={apptForm.preferredTime}
                onChange={(e) => setApptForm({ ...apptForm, preferredTime: e.target.value })}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="crysto-grid-3">
            <div>
              <label className="crysto-label">Have you shopped with us previously?*</label>
              <div className="crysto-radio-group">
                <label className="crysto-radio-label">
                  <span>yes</span>
                  <input
                    type="radio"
                    name="shoppedPreviously"
                    value="yes"
                    checked={apptForm.shoppedPreviously === 'yes'}
                    onChange={() => setApptForm({ ...apptForm, shoppedPreviously: 'yes' })}
                  />
                </label>
                <label className="crysto-radio-label">
                  <span>no</span>
                  <input
                    type="radio"
                    name="shoppedPreviously"
                    value="no"
                    checked={apptForm.shoppedPreviously === 'no'}
                    onChange={() => setApptForm({ ...apptForm, shoppedPreviously: 'no' })}
                  />
                </label>
              </div>
            </div>
            <div>
              <label className="crysto-label">If &apos;Yes&apos; which sales associate did you work with?</label>
              <input
                type="text"
                className="crysto-input"
                placeholder="Enter your subject"
                value={apptForm.salesAssociate}
                onChange={(e) => setApptForm({ ...apptForm, salesAssociate: e.target.value })}
              />
            </div>
            <div>
              <label className="crysto-label">How do you prefer we contact you? *</label>
              <input
                type="text"
                required
                className="crysto-input"
                placeholder="Enter your subject"
                value={apptForm.contactPreference}
                onChange={(e) => setApptForm({ ...apptForm, contactPreference: e.target.value })}
              />
            </div>
          </div>

          {/* Row 4: Message */}
          <div className="crysto-textarea-block">
            <label className="crysto-label">Message</label>
            <textarea
              className="crysto-textarea"
              placeholder="Enter your message..."
              value={apptForm.message}
              onChange={(e) => setApptForm({ ...apptForm, message: e.target.value })}
            />
          </div>

          {/* Row 5: Action */}
          <div className="crysto-bottom-action-row">
            <button type="submit" className="crysto-submit-btn">
              SEND YOUR MESSAGE
            </button>
            <label className="crysto-consent-label">
              <input
                type="checkbox"
                className="crysto-circle-checkbox"
                checked={apptForm.saveInfo}
                onChange={(e) => setApptForm({ ...apptForm, saveInfo: e.target.checked })}
              />
              <span>Save my name, email, and website in this browser for the next time I comment.</span>
            </label>
          </div>
        </form>
      )}

      {/* ── Tab 3: SCHEDULE A SERVICE APPOINTMENT ──────────────────── */}
      {activeTab === 'service' && (
        <form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div className="crysto-grid-2">
            <div>
              <label className="crysto-label">Full name*</label>
              <input
                type="text"
                required
                className="crysto-input"
                placeholder="Enter your name"
                value={serviceForm.fullName}
                onChange={(e) => setServiceForm({ ...serviceForm, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="crysto-label">Select a Showroom *</label>
              <select
                required
                className="crysto-select"
                value={serviceForm.showroom}
                onChange={(e) => setServiceForm({ ...serviceForm, showroom: e.target.value })}
              >
                <option value="Private Consultation">Private Consultation</option>
                <option value="New York, NY">New York, NY</option>
                <option value="Los Angeles, CA">Los Angeles, CA</option>
                <option value="Melbourne, Australia">Melbourne, Australia</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="crysto-grid-2">
            <div>
              <label className="crysto-label">Phone number*</label>
              <input
                type="tel"
                required
                className="crysto-input"
                placeholder="Enter phone number"
                value={serviceForm.phone}
                onChange={(e) => setServiceForm({ ...serviceForm, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="crysto-label">Email address*</label>
              <input
                type="email"
                required
                className="crysto-input"
                placeholder="Email address"
                value={serviceForm.email}
                onChange={(e) => setServiceForm({ ...serviceForm, email: e.target.value })}
              />
            </div>
          </div>

          {/* Row 3: Was the item purchased from us */}
          <div style={{ clear: 'both', marginBottom: '22px' }}>
            <label className="crysto-label">Was the item purchased from us? *</label>
            <div className="crysto-radio-group">
              <label className="crysto-radio-label">
                <span>yes</span>
                <input
                  type="radio"
                  name="purchasedFromUs"
                  value="yes"
                  checked={serviceForm.purchasedFromUs === 'yes'}
                  onChange={() => setServiceForm({ ...serviceForm, purchasedFromUs: 'yes' })}
                />
              </label>
              <label className="crysto-radio-label">
                <span>no</span>
                <input
                  type="radio"
                  name="purchasedFromUs"
                  value="no"
                  checked={serviceForm.purchasedFromUs === 'no'}
                  onChange={() => setServiceForm({ ...serviceForm, purchasedFromUs: 'no' })}
                />
              </label>
            </div>
          </div>

          {/* Row 4: Account name */}
          <div style={{ clear: 'both', marginBottom: '22px' }}>
            <label className="crysto-label">
              If &apos;Yes&apos; to the previous question, what is the name associated with your account/purchase?
            </label>
            <input
              type="text"
              className="crysto-input"
              placeholder="Name an account"
              value={serviceForm.accountName}
              onChange={(e) => setServiceForm({ ...serviceForm, accountName: e.target.value })}
            />
          </div>

          {/* Row 5: Services needed */}
          <div className="crysto-textarea-block">
            <label className="crysto-label">
              Description of services needed (ex: sizing, cleaning, loose diamond, rhodium plating, etc...)*
            </label>
            <textarea
              required
              className="crysto-textarea"
              placeholder="Type here..."
              value={serviceForm.serviceDescription}
              onChange={(e) => setServiceForm({ ...serviceForm, serviceDescription: e.target.value })}
            />
          </div>

          {/* Row 6: Action */}
          <div className="crysto-bottom-action-row">
            <button type="submit" className="crysto-submit-btn">
              SEND YOUR MESSAGE
            </button>
            <label className="crysto-consent-label">
              <input
                type="checkbox"
                className="crysto-circle-checkbox"
                checked={serviceForm.saveInfo}
                onChange={(e) => setServiceForm({ ...serviceForm, saveInfo: e.target.checked })}
              />
              <span>Save my name, email, and website in this browser for the next time I comment.</span>
            </label>
          </div>
        </form>
      )}
    </div>
  );
}
