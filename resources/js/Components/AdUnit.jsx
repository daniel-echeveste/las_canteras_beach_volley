import React, { useEffect } from 'react';

export default function AdUnit({ format = 'auto', slot = '' }) {
    useEffect(() => {
        try {
            // Push ad to adsbygoogle queue when component mounts
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    return (
        <div className="ad-container">
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-4538032873726641"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    );
}
