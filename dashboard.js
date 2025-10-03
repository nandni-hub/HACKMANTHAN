let certificates = [];

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Scroll to section and set active link
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });

        document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
        event.target.classList.add('active');
    }
}

// Live section highlight
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinksElements = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) current = section.getAttribute('id');
    });

    navLinksElements.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('onclick').includes(current)) link.classList.add('active');
    });
});

// Open certificate preview
function openCertificatePreview() {
    const eventName = document.getElementById("event_name").value;
    const eventDate = document.getElementById("event_date").value;
    const organizer = document.getElementById("organizer").value;

    if (!eventName || !eventDate || !organizer) {
        alert("Please fill in all event details first!");
        return;
    }

    const participant = "John Doe"; // Sample
    window.open(
        `certificate.html?name=${encodeURIComponent(participant)}&event=${encodeURIComponent(eventName)}&date=${encodeURIComponent(eventDate)}&organizer=${encodeURIComponent(organizer)}`,
        "_blank"
    );
}

// Generate certificates
function generateCertificates(event) {
    event.preventDefault();

    const eventName = document.getElementById('event_name').value;
    const eventDate = document.getElementById('event_date').value;
    const organizer = document.getElementById('organizer').value;
    const participantsText = document.getElementById('participants').value;
    const sendEmail = document.getElementById('send_email').checked;
    const sendWhatsapp = document.getElementById('send_whatsapp').checked;

    if (!sendEmail && !sendWhatsapp) {
        alert('Please select at least one distribution method!');
        return;
    }

    const participantLines = participantsText.trim().split('\n');
    const newCertificates = [];

    participantLines.forEach(line => {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 2) {
            const [name, email] = parts;
            const status = Math.random() > 0.2 ? 'delivered' : (Math.random() > 0.5 ? 'pending' : 'bounced');
            
            newCertificates.push({
                name,
                email,
                status,
                sentAt: new Date().toLocaleString(),
                eventName,
                eventDate,
                organizer,
                methods: {
                    email: sendEmail,
                    whatsapp: sendWhatsapp
                }
            });
        }
    });

    certificates = [...certificates, ...newCertificates];
    updateDashboard();
    updateTable();
    
    alert(`✅ Successfully generated ${newCertificates.length} certificates!`);
    document.getElementById('certForm').reset();
    scrollToSection('tracking');

    // --- Redirect if only one method is selected ---
    if (sendEmail && !sendWhatsapp) {
        window.open('https://mail.google.com/mail/u/0/#inbox', '_blank');
    } else if (!sendEmail && sendWhatsapp) {
        window.open('https://web.whatsapp.com/', '_blank');
    }
}

// Update dashboard stats
function updateDashboard() {
    const total = certificates.length;
    const delivered = certificates.filter(c => c.status === 'delivered').length;
    const pending = certificates.filter(c => c.status === 'pending').length;
    const bounced = certificates.filter(c => c.status === 'bounced').length;

    document.getElementById('totalCerts').textContent = total;
    document.getElementById('deliveredCerts').textContent = delivered;
    document.getElementById('pendingCerts').textContent = pending;
    document.getElementById('bouncedCerts').textContent = bounced;

    const percentage = total > 0 ? Math.round((delivered / total) * 100) : 0;
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = 
        `${percentage}% Complete (${delivered} / ${total})`;
}

// Update tracking table
function updateTable() {
    const tbody = document.getElementById('certificateTableBody');
    
    if (certificates.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #6b7280;">
                    No certificates generated yet. Start by generating certificates above!
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = certificates.map((cert, index) => `
        <tr>
            <td>${cert.name}</td>
            <td>${cert.email}</td>
            <td><span class="status-badge status-${cert.status}">${cert.status.toUpperCase()}</span></td>
            <td>${cert.sentAt}</td>
            <td>
                <button class="btn-action" onclick="resendCertificate(${index})">
                    ${cert.status === 'bounced' ? '🔄 Retry' : '📤 Resend'}
                </button>
            </td>
        </tr>
    `).join('');
}

// Resend certificate simulation
function resendCertificate(index) {
    certificates[index].status = 'pending';
    certificates[index].sentAt = new Date().toLocaleString();
    updateDashboard();
    updateTable();

    setTimeout(() => {
        certificates[index].status = Math.random() > 0.3 ? 'delivered' : 'bounced';
        certificates[index].sentAt = new Date().toLocaleString();
        updateDashboard();
        updateTable();
        alert(`Certificate resent to ${certificates[index].name}!`);
    }, 1000);
}
