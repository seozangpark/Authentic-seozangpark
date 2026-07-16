// ==========================================
// 1. DISCORD WEBHOOK URLs SETUP (YAHAN PASTE KAREIN)
// ==========================================
// Yahan apne "Artworks" channel ka Webhook URL paste karo (quotes "" ke andar):
const ART_WEBHOOK_URL = "https://discord.com/api/webhooks/1527395733811232959/atMG6SiYv3GLgTk7Zm0f5-cxA6YVGxNKEbekpJhA3FoqC9h2DI87GsELcVmnjd5RVqSN";

// Yahan apne "Websites" channel ka Webhook URL paste karo (quotes "" ke andar):
const WEB_WEBHOOK_URL = "https://discord.com/api/webhooks/1527395281262350468/YfTdXduh4UsaJ2fw5NmZFVDNtDfSj9aNsNelBz-ELV_YkYyrsqZg_SrgLAWRHWAUKYFc";


// ==========================================
// 2. ACCORDION & SCROLL ANIMATION
// ==========================================
function toggleAccordion(contentId, btnElement) {
    const content = document.getElementById(contentId);
    
    // Toggle active class for color change
    btnElement.classList.toggle("active");
    
    // Smooth Height Animation
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        // Expand
        content.style.maxHeight = content.scrollHeight + "px";
        
        // Smooth scroll thoda delay ke baad taaki expand hone ka time mile
        setTimeout(() => {
            btnElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Height update karna padega agar window resize ho ya elements large hon
            content.style.maxHeight = "1500px"; 
        }, 300);
    }
}

// ==========================================
// 3. FORM SUBMISSION TO DISCORD (ARTWORKS)
// ==========================================
async function submitArtForm(event) {
    event.preventDefault(); // Page refresh hone se rokna
    const form = event.target;
    const submitBtn = document.getElementById('art-submit-btn');
    submitBtn.innerText = "Sending Order...";
    submitBtn.disabled = true;

    // Form ka saara data collect karna
    const formData = new FormData(form);
    
    // Discord Message Format (Text Part)
    let messageText = "**🎨 NEW ARTWORK ORDER RECEIVED!**\n\n";
    for (let [key, value] of formData.entries()) {
        if(key !== 'image') {
            messageText += `**${key}:** ${value}\n`;
        }
    }

    // Payload banana jisme Text aur Image dono jayenge
    const payload = new FormData();
    payload.append('payload_json', JSON.stringify({ content: messageText }));

    const imageFile = form.querySelector('input[type="file"]').files[0];
    if (imageFile) {
        payload.append('file', imageFile);
    }

    try {
        const response = await fetch(ART_WEBHOOK_URL, {
            method: 'POST',
            body: payload
        });

        if (response.ok) {
            alert("Order Submitted Successfully! We will contact you soon.");
            form.reset();
            // Close Accordion smoothly
            form.closest('.accordion-content').style.maxHeight = null;
            form.closest('.order-card').querySelector('.accordion-btn').classList.remove('active');
        } else {
            alert("Error sending order. Please check webhook URL.");
        }
    } catch (error) {
        alert("Network Error! Please try again.");
    } finally {
        submitBtn.innerText = "Submit Order";
        submitBtn.disabled = false;
    }
}

// ==========================================
// 4. FORM SUBMISSION TO DISCORD (WEBSITES)
// ==========================================
async function submitWebForm(event) {
    event.preventDefault(); // Page refresh rokna
    const form = event.target;
    const submitBtn = document.getElementById('web-submit-btn');
    submitBtn.innerText = "Sending Order...";
    submitBtn.disabled = true;

    const formData = new FormData(form);
    
    // Discord Message Format
    let messageText = "**💻 NEW WEBSITE ORDER RECEIVED!**\n\n";
    for (let [key, value] of formData.entries()) {
        messageText += `**${key}:** ${value}\n`;
    }

    // Isme koi file nahi hai, sirf text hai toh normal JSON bhejenge
    try {
        const response = await fetch(WEB_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: messageText })
        });

        if (response.ok) {
            alert("Order Submitted Successfully! We will contact you soon.");
            form.reset();
            // Close Accordion smoothly
            form.closest('.accordion-content').style.maxHeight = null;
            form.closest('.order-card').querySelector('.accordion-btn').classList.remove('active');
        } else {
            alert("Error sending order. Please check webhook URL.");
        }
    } catch (error) {
        alert("Network Error! Please try again.");
    } finally {
        submitBtn.innerText = "Submit Order";
        submitBtn.disabled = false;
    }
}
