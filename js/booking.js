document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    const progress = document.querySelector('.progress');
    const steps = document.querySelectorAll('.step');
    const formSections = document.querySelectorAll('.form-section');
    let currentStep = 0;

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
        
        if (currentStep === 2) { // Confirmation step
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
            if (!field.value.trim() || (field.type === 'email' && !field.checkValidity())) {
                valid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        return valid;
    }

    // Update review info in confirmation step
    function updateReviewInfo() {
        const reviewInfo = document.querySelector('.review-info');
        reviewInfo.innerHTML = `
            <p><strong>Name:</strong> ${document.getElementById('first-name').value} ${document.getElementById('last-name').value}</p>
            <p><strong>Email:</strong> ${document.getElementById('email').value}</p>
            <p><strong>Phone:</strong> ${document.getElementById('phone').value}</p>
            <p><strong>Contact Time:</strong> ${document.getElementById('contact-time').value}</p>
            <p><strong>Service:</strong> ${document.getElementById('service-type').value}</p>
        `;
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        form.insertBefore(errorDiv, form.firstChild);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    // Reset the current step when the form is submitted
    form.addEventListener('submit', handleFormSubmit);

    function handleFormSubmit(event) {
        event.preventDefault();
        
        // Collect form data
        const formData = new FormData(event.target);
        let appointmentDetails = '';
        
        for (let [key, value] of formData.entries()) {
            if (value && key !== 'terms') {
                let formattedKey = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                appointmentDetails += `<strong>${formattedKey}:</strong> ${value}<br>`;
            }
        }

        // Create and show the animated message
        const message = document.createElement('div');
        message.className = 'booking-confirmed-message';
        message.innerHTML = `
            <h2>Booking Confirmed!</h2>
            <p>Thank you for booking your appointment with Bright Smile Clinic.</p>
            <p>We've sent a confirmation email with your appointment details.</p>
            <h3>Appointment Details:</h3>
            <p>${appointmentDetails}</p>
        `;
        document.body.appendChild(message);

        // Set a timer to remove the message
        let removeTimeout = setTimeout(() => {
            document.body.removeChild(message);
        }, 7000);

        // Prevent message from disappearing when hovered
        message.addEventListener('mouseenter', () => {
            clearTimeout(removeTimeout);
        });

        // Allow message to disappear when not hovered
        message.addEventListener('mouseleave', () => {
            removeTimeout = setTimeout(() => {
                document.body.removeChild(message);
            }, 7000);
        });

        // Reset the form
        event.target.reset();

        // Reset progress bar and go back to first step
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index === 0);
        });
        document.querySelectorAll('.form-section').forEach((section, index) => {
            section.classList.toggle('active', index === 0);
        });

        // Reset the progress bar width
        if (progress) {
            progress.style.width = '0%';
        }

        // Reset the current step
        currentStep = 0;
    }
});