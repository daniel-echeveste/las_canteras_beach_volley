import React, { useEffect, useRef } from 'react';

export default function AdUnit({ format = 'auto', slot = '' }) {
    const adRef = useRef(null);
    const isAdLoaded = useRef(false);

    useEffect(() => {
        // Only load ad once and when the container is visible
        if (isAdLoaded.current) return;

        const loadAd = () => {
            try {
                if (adRef.current && adRef.current.offsetWidth > 0) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    isAdLoaded.current = true;
                }
            } catch (e) {
                console.error('AdSense error:', e);
            }
        };

        // Small delay to ensure DOM is fully rendered with dimensions
        const timer = setTimeout(loadAd, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div ref={adRef} className="ad-container w-full">
            <ins
                className="adsbygoogle"
                style={{ display: 'block', minWidth: '250px', minHeight: '100px', width: '100%' }}
                data-ad-client="ca-pub-4538032873726641"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    );
}
