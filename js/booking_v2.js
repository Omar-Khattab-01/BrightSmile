document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    const progress = document.querySelector('.progress');
    const steps = document.querySelectorAll('.step');
    const formSections = document.querySelectorAll('.form-section');
    let currentStep = 0;

    // Initialize date restrictions
    const appointmentDate = document.getElementById('appointment-date');
    if (appointmentDate) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        
        appointmentDate.min = tomorrow.toISOString().split('T')[0];
        appointmentDate.max = maxDate.toISOString().split('T')[0];
    }

    // Initialize the first section
    formSections[0].classList.add('active');
    updateProgress();

    // Navigation buttons event listeners
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const direction = button.classList.contains('next') ? 1 : -1;
            
            if (direction === 1 && !validateSection(currentStep)) {
                showError('Please fill in all required fields');
                return;
            }

            navigate(direction);
        });
    });

    function navigate(direction) {
        formSections[currentStep].classList.remove('active');
        currentStep = Math.max(0, Math.min(formSections.length - 1, currentStep + direction));
        formSections[currentStep].classList.add('active');
        
        if (currentStep === formSections.length - 1) {
            updateReviewInfo();
        }
        
        updateProgress();
    }

    function updateProgress() {
        const progressWidth = (currentStep / (steps.length - 1)) * 100;
        progress.style.width = `${progressWidth}%`;
        
        steps.forEach((step, idx) => {
            step.classList.toggle('active', idx <= currentStep);
        });
    }

    function validateSection(sectionIndex) {
        const currentSection = formSections[sectionIndex];
        const requiredFields = currentSection.querySelectorAll('[required]');
        let valid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim() || (field.type === 'radio' && !currentSection.querySelector(`input[name="${field.name}"]:checked`))) {
                valid = false;
                field.closest('.form-group')?.classList.add('error');
            } else {
                field.closest('.form-group')?.classList.remove('error');
            }
        });

        if (!valid) {
            showError('Please fill in all required fields');
        }

        return valid;
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Remove any existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        form.insertBefore(errorDiv, form.firstChild);
        
        // Remove error after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    function updateReviewInfo() {
        const reviewInfo = document.querySelector('.review-info');
        const service = document.querySelector('input[name="service"]:checked');
        reviewInfo.innerHTML = `
            <div class="review-section">
                <h4>Selected Service</h4>
                <p>${service ? service.parentElement.querySelector('label').textContent : 'No service selected'}</p>
            </div>
            <div class="review-section">
                <h4>Appointment Time</h4>
                <p>Date: ${document.getElementById('appointment-date').value}</p>
                <p>Time: ${document.getElementById('appointment-time').value}</p>
            </div>
            <div class="review-section">
                <h4>Personal Information</h4>
                <p>Name: ${document.getElementById('first-name').value} ${document.getElementById('last-name').value}</p>
                <p>Email: ${document.getElementById('email').value}</p>
                <p>Phone: ${document.getElementById('phone').value}</p>
            </div>
            <div class="review-section">
                <h4>Contact Preferences</h4>
                <p>Email Updates: ${document.getElementById('email-updates').checked ? 'Yes' : 'No'}</p>
                <p>Contact Methods: ${getSelectedContactMethods()}</p>
                <p>Preferred Contact Time: ${document.getElementById('contact-time').value}</p>
            </div>
            <div class="review-section">
                <h4>Service/h4>
                <p>Service: ${document.getElementById('service-type').value}</p>

            </div>
        `;
    }

    function getSelectedContactMethods() {
        const methods = [];
        if (document.getElementById('contact-phone').checked) methods.push('Phone');
        if (document.getElementById('contact-email').checked) methods.push('Email');
        return methods.join(', ') || 'None selected';
    }

    function handleFormSubmit() {
        if (!validateSection(currentStep)) {
            return;
        }
        
        // Here you would typically send the data to your server
        // For now, we'll just show a success message
        const confirmationMessage = document.createElement('div');
        confirmationMessage.className = 'confirmation-message';
        confirmationMessage.innerHTML = `
            <h3>Booking Confirmed!</h3>
            <p>Thank you for choosing BrightSmile Dental Clinic.</p>
            <p>We've sent a confirmation email to ${document.getElementById('email').value}</p>
            <p>Your appointment is scheduled for:</p>
            <p><strong>${document.getElementById('appointment-date').value} at ${document.getElementById('appointment-time').value}</strong></p>
        `;
        
        form.innerHTML = '';
        form.appendChild(confirmationMessage);
    }

    // Expose handleFormSubmit to global scope
    window.handleFormSubmit = handleFormSubmit;
});

document.addEventListener('DOMContentLoaded', function() {
    const selectedService = localStorage.getItem('selectedService');
    if (selectedService) {
        document.querySelector('[name="service"]').value = selectedService;
    }
});