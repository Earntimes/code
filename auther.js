(function() {
    // --- CONFIGURATION START ---

    const allowedDomains = [
        'earntimes.in', // 
        'www.earntimes.in', // WWW version bhi daalein
        'earntimestheme.blogspot.com', // Aapka doosra domain (e.g., blogspot)
        'localhost' // Agar aap local development karte hain (optional)
    ];

    const errorMessageHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.95); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 99999999; text-align: center; font-family: Arial, sans-serif; padding: 20px; box-sizing: border-box;">
            <h1 style="font-size: 28px; margin-bottom: 15px;">Theme Authorization Error</h1>
            <p style="font-size: 18px; margin-bottom: 20px;">This domain is not authorized to use this theme.</p>
            <p style="font-size: 16px;">Please purchase a valid license or contact the theme developer at <a href="mailto:your-email@example.com" style="color: #FFEB3B; text-decoration: none;">your-email@example.com</a>.</p>
            <p style="font-size: 16px; margin-top: 20px;"><a href="https://your-theme-purchase-link.com" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Buy Theme License</a></p>
        </div>
    `;
    // --- CONFIGURATION END ---

    const currentHostname = window.location.hostname;
    let isAuthorized = false;

    for (let i = 0; i < allowedDomains.length; i++) {
        if (currentHostname === allowedDomains[i]) {
            isAuthorized = true;
            break;
        }
    }

    if (!isAuthorized) {
        // DOM ready hone ka wait karein taaki body element available ho
        document.addEventListener('DOMContentLoaded', function() {
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = errorMessageHTML;
            document.body.appendChild(errorDiv.firstChild);
            // document.body.style.overflow = 'hidden'; // Scrollbar hide
            // if (document.body.firstChild && document.body.firstChild.nextSibling) {
            //    Array.from(document.body.children).forEach(child => {
            //        if (child !== errorDiv.firstChild.parentNode) child.style.display = 'none';
            //    });
            // }
        });
        // document.open();
        // document.write(errorMessageHTML); //
        // document.close();
    }
})();
