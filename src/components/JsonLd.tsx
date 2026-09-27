export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Resort",
    "name": "AMARTA Sanctuary & Private Villas",
    "alternateName": "AMARTA Villas Ubud",
    "description": "Secluded luxury boutique pool villas along the Ayung River gorge in Sayan, Ubud, Bali.",
    "url": "https://amartavillas.com",
    "telephone": "+6285129627403",
    "priceRange": "IDR 9,500,000 - IDR 27,500,000",
    "currenciesAccepted": "IDR, USD",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "checkinTime": "15:00",
    "checkoutTime": "12:00",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Raya Sayan No. 88",
      "addressLocality": "Ubud",
      "addressRegion": "Bali",
      "postalCode": "80571",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -8.50394,
      "longitude": 115.24522
    },
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Private Heated Mineral Pool",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "24/7 Dedicated Estate Butler",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Ayung River Valley Panorama",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Woodfire Regenerative Gastronomy",
        "value": true
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
