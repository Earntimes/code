(function() {
    // --- CONFIGURATION START ---
    // Apne authorized domains/paths yahaan daalein
    // IMPORTANT: Blogger ke preview URLs ko bhi dhyan mein rakhein.
    // Examples: 'yourblog.blogspot.com', 'www.yourdomain.com', 'localhost'
    // Blogger preview URLs examples:
    // - Agar aapka blog 'myblog.blogspot.com' hai, toh preview URL 'myblog.blogspot.com/b/post-preview?token=...' jaisa ho sakta hai.
    // - Editor mein 'www.blogger.com/blog/post/edit/...'
    // - Draft mode 'draft.blogger.com/...'
    const allowedHostnamesOrPaths = [
        // -------- APNE DOMAINS YAHAAN DAALEIN --------
        'your-primary-domain.com',
        'earntimestheme.blogspot.com',
        'www.your-primary-domain.com',
        'your-blogname.blogspot.com', // Agar blogspot par hai
        'localhost', // Local development ke liye

        // -------- BLOGGER SPECIFIC PREVIEW/DRAFT URLs (inko zaroor check karein) --------
        // Ye common patterns hain, aapko apne exact preview URLs dekhkar add karna pad sakta hai
        'draft.blogger.com', // Blogger draft mode
        'www.blogger.com',   // Agar www.blogger.com ke editor se preview kar rahe hain

        // Example of specific paths on blogger.com (agar zaroorat pade)
        // 'www.blogger.com/blog/post/edit/preview', // Specific path
        // 'www.blogger.com/u/0/blogger.g', // Another Blogger internal URL

        // -------- AUR KOI DOMAIN JO AUTHORIZED HO --------
        // 'another-authorized-domain.net',
        // -------- EXAMPLES FROM OG CODE (Aapko inko verify karna hoga ki aapke hain ya nahi) --------
        // "https://www.hdhub4u.agency",
        // "https://movies4u.press",
        // "https://filmflicker25.blogspot.com",
        // ... (Baaqi OG list se aap apne domains select karke daal sakte hain)
    ];

    // Error message jo dikhana hai
    const errorMessageHTML = `
        <div id="themeAuthErrorOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.97); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 2147483647; text-align: center; font-family: Arial, sans-serif; padding: 20px; box-sizing: border-box;">
            <h1 style="font-size: 28px; margin-bottom: 15px; color: #FF5722;">Theme Authorization Error</h1>
            <p style="font-size: 18px; margin-bottom: 20px;">This domain (<strong style="color: #FFC107;">${window.location.hostname}</strong>) is not authorized to use this theme.</p>
            <p style="font-size: 16px;">To use this theme, please purchase a valid license or contact the theme developer for assistance.</p>
            <p style="font-size: 16px; margin-top: 30px;">
                <a href="YOUR_THEME_PURCHASE_LINK_HERE" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">Buy Theme License</a>
                <a href="mailto:YOUR_SUPPORT_EMAIL_HERE" style="background-color: #2196F3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Contact Support</a>
            </p>
        </div>
    `;
    // --- CONFIGURATION END ---

    const currentFullURL = window.location.href;
    const currentHostname = window.location.hostname;
    let isAuthorized = false;

    // Normalize allowed hostnames/paths for comparison
    const normalizedAllowed = allowedHostnamesOrPaths.map(item => {
        try {
            // If it's a full URL, get hostname. Otherwise, use as is (for paths or partial matches).
            const url = new URL(item.startsWith('http') ? item : `http://${item}`);
            return url.hostname;
        } catch (e) {
            // If not a valid URL (e.g. "localhost", or a path like "/preview"), use the item directly.
            return item.toLowerCase();
        }
    });
    
    const normalizedCurrentHostname = currentHostname.toLowerCase();

    for (let i = 0; i < normalizedAllowed.length; i++) {
        const allowedItem = normalizedAllowed[i];
        // Check 1: Exact hostname match
        if (normalizedCurrentHostname === allowedItem) {
            isAuthorized = true;
            break;
        }
        // Check 2: If allowedItem is a path (starts with /) or a more general string, check if currentFullURL includes it.
        // This is for cases like 'draft.blogger.com' or '/blog/post/edit/'
        if (currentFullURL.toLowerCase().includes(allowedItem)) {
            isAuthorized = true;
            break;
        }
    }
    
    // Specific check for blogger.com editor/preview scenarios
    if (normalizedCurrentHostname === 'www.blogger.com' || normalizedCurrentHostname === 'blogger.com') {
      if (currentFullURL.includes('/blog/post/edit/') || currentFullURL.includes('/blogger.g?blogID=') || currentFullURL.includes('/b/preview')) {
        isAuthorized = true;
      }
    }

    // Specific check for blogspot.com preview URLs (often include /b/ or specific query params)
    if (normalizedCurrentHostname.endsWith('.blogspot.com')) {
        if (currentFullURL.includes('/b/post-preview') || currentFullURL.includes('/b/page-preview') || currentFullURL.includes('?pli=1')) { // common preview patterns
            isAuthorized = true;
        }
    }


    if (!isAuthorized) {
        const showError = function() {
            // Remove any existing error overlay to prevent duplicates if script runs multiple times
            const existingOverlay = document.getElementById('themeAuthErrorOverlay');
            if (existingOverlay) {
                existingOverlay.parentNode.removeChild(existingOverlay);
            }

            // Option 1: Overlay the entire page
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = errorMessageHTML;
            // Clear the body and append error message
            document.body.innerHTML = ''; 
            document.body.appendChild(errorDiv.firstChild); // Append the actual div, not the container
            document.body.style.cssText = "margin:0; padding:0; height:100vh; overflow:hidden; background-color: #121212;"; // Ensure body itself is styled
            document.documentElement.style.cssText = "height:100vh; overflow:hidden;"; // Prevent scroll on html element too

            // Option 2 (Alternative): Replace content of a specific main element (less aggressive)
            // This requires knowing a common main content selector for your themes
            /*
            const mainSelectors = ['.blog-posts', '#main-wrapper', '#main', 'article', 'main']; // Add more if needed
            let mainElement = null;
            for (const selector of mainSelectors) {
                mainElement = document.querySelector(selector);
                if (mainElement) break;
            }

            if (mainElement) {
                mainElement.innerHTML = errorMessageHTML;
                mainElement.style.cssText = "width: 100%; height: auto; padding: 0; margin:0; display: block; position:relative; z-index:2147483647;";
                // Hide other elements if necessary
                Array.from(document.body.children).forEach(child => {
                    if (child !== mainElement && child.tagName.toLowerCase() !== 'script' && child.tagName.toLowerCase() !== 'style') {
                       // child.style.display = 'none';
                    }
                });
                document.body.style.overflow = 'hidden';

            } else {
                // Fallback to full overlay if no main element found
                const errorDiv = document.createElement('div');
                errorDiv.innerHTML = errorMessageHTML;
                document.body.innerHTML = '';
                document.body.appendChild(errorDiv.firstChild);
                document.body.style.cssText = "margin:0; padding:0; height:100vh; overflow:hidden; background-color: #121212;";
                document.documentElement.style.cssText = "height:100vh; overflow:hidden;";
            }
            */
        };

        if (document.readyState === 'loading') {
            // DOM hasn't finished loading yet, wait for it.
            document.addEventListener('DOMContentLoaded', showError);
        } else {
            // DOM is already loaded.
            showError();
        }
    }
})();
