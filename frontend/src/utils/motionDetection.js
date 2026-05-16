export const hasSceneChanged = (videoElement, lastCanvasDataRef) => {
    if (!videoElement || videoElement.videoWidth === 0) return false;
    
    const canvas = document.createElement('canvas');
    // Scale down drastically for speed
    canvas.width = 30; 
    canvas.height = 30; 
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    if (!lastCanvasDataRef.current) {
        lastCanvasDataRef.current = currentData;
        return true; 
    }
    
    let diffPixels = 0;
    // Compare pixel by pixel
    for (let i = 0; i < currentData.length; i += 4) {
        const rDiff = Math.abs(currentData[i] - lastCanvasDataRef.current[i]);
        const gDiff = Math.abs(currentData[i+1] - lastCanvasDataRef.current[i+1]);
        const bDiff = Math.abs(currentData[i+2] - lastCanvasDataRef.current[i+2]);
        
        // If color difference is significant
        if (rDiff + gDiff + bDiff > 100) { 
            diffPixels++;
        }
    }
    
    lastCanvasDataRef.current = currentData;
    
    // If more than 8% of pixels changed, trigger API call
    return diffPixels > (canvas.width * canvas.height * 0.08);
 };
 
