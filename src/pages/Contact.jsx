import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    // Guardar los datos enviados
    const submission = {
      ...formData,
      date: new Date().toISOString(),
      id: Date.now()
    };

    setSubmittedData(submission);

    // Limpiar el formulario
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleReset = () => {
    setSubmittedData(null);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>📧 Contacto</h1>
        <p className="contact-subtitle">
          ¿Tienes alguna pregunta o sugerencia? ¡Nos encantaría escucharte!
        </p>

        {!submittedData ? (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Asunto</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="¿Sobre qué quieres escribir?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Mensaje *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Escribe tu mensaje aquí..."
                rows="6"
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Enviar Mensaje
            </button>
          </form>
        ) : (
          <div className="submission-display">
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h2>¡Mensaje Recibido!</h2>
              <p>Gracias por contactarnos. Aquí está la información que enviaste:</p>
            </div>

            <div className="submitted-data">
              <div className="data-item">
                <strong>Nombre:</strong>
                <span>{submittedData.name}</span>
              </div>

              <div className="data-item">
                <strong>Email:</strong>
                <span>{submittedData.email}</span>
              </div>

              {submittedData.subject && (
                <div className="data-item">
                  <strong>Asunto:</strong>
                  <span>{submittedData.subject}</span>
                </div>
              )}

              <div className="data-item">
                <strong>Mensaje:</strong>
                <div className="message-content">{submittedData.message}</div>
              </div>

              <div className="data-item">
                <strong>Fecha de envío:</strong>
                <span>
                  {new Date(submittedData.date).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <button className="reset-btn" onClick={handleReset}>
              Enviar Otro Mensaje
            </button>
          </div>
        )}

        <div className="contact-info">
          <h3>Otras formas de contacto</h3>
          <div className="contact-methods">
            <div className="contact-method">
              <span className="method-icon">📧</span>
              <div>
                <strong>Email</strong>
                <p>info@fmrates.com</p>
              </div>
            </div>

            <div className="contact-method">
              <span className="method-icon">💬</span>
              <div>
                <strong>Soporte</strong>
                <p>Respondemos en 24-48 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
