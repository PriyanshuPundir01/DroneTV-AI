import React, { useState } from 'react';
import { WeightTiltCard } from './WeightTiltCard';
import {
  Video,
  MapPin,
  Sprout,
  Shield,
  Search,
  Check,
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const services = [
    {
      id: 'cinematography',
      category: 'media',
      title: 'Aerial Cinematography & Live Broadcasting',
      description:
        'High-end cinematic aerial footage for feature films, commercials, and ultra-low latency live multi-camera television broadcasting.',
      icon: Video,
      badge: 'Cinema 8K HDR',
      deliverables: [
        'RED / ARRI Cinema Heavy-Lift Drones',
        'Live 1080p/4K SDI Broadcast Links',
        'Dual-Operator Master Gimbal Control',
        'FPV Chase Cam for High-Speed Action'
      ],
      turnaround: 'Same-day rush rushes available',
      tag: 'Media & Entertainment'
    },
    {
      id: 'surveying',
      category: 'gis',
      title: 'LiDAR Mapping & Topographical Surveying',
      description:
        'Centimeter-grade topographical surveying, digital surface models (DSM), volumetric calculations, and urban GIS infrastructure analysis.',
      icon: MapPin,
      badge: 'Sub-cm Accuracy',
      deliverables: [
        'High-density 3D LiDAR Point Clouds',
        'GeoTIFF Orthomosaics & Contours',
        'Volumetric Stockpile Cut/Fill Reports',
        'DGCA Digital Sky Flight Authorizations'
      ],
      turnaround: '24-48 hours post-flight processing',
      tag: 'Survey & GIS'
    },
    {
      id: 'agriculture',
      category: 'agri',
      title: 'Precision Agriculture & Automated Spraying',
      description:
        'Multispectral crop health indexing (NDVI/NDRE), targeted nutrient management, and autonomous 10L-30L payload pesticide spray solutions.',
      icon: Sprout,
      badge: 'Up to 30 Acres/Hour',
      deliverables: [
        'NDVI Crop Stress & Vigor Diagnostics',
        'Automated Variable-Rate Spraying Plans',
        'Soil Moisture & Yield Estimation Maps',
        'Eco-friendly 90% Water Conservation'
      ],
      turnaround: 'Rapid seasonal deployment',
      tag: 'AgriTech'
    },
    {
      id: 'inspection',
      category: 'industrial',
      title: 'Industrial & Photovoltaic Infrastructure Inspection',
      description:
        'Radiometric thermal thermography and high-zoom visual inspection of solar PV panels, wind turbine blades, flare stacks, and high-tension utility pylons.',
      icon: Search,
      badge: 'Radiometric Thermal',
      deliverables: [
        'FLIR Thermal Hot-spot & Fault Detection',
        'AI Automated Anomaly Tagging Reports',
        'Wind Turbine Blade Structural Scans',
        'Confined Space Boiler & Tank Audits'
      ],
      turnaround: 'Certified thermography reports',
      tag: 'Industrial Asset Audit'
    },
    {
      id: 'surveillance',
      category: 'security',
      title: 'Disaster Management & Perimeter Surveillance',
      description:
        'Tactical long-endurance autonomous tethered and untethered surveillance for perimeter security, crowd management, and flood/wildfire monitoring.',
      icon: Shield,
      badge: '24/7 Night Vision',
      deliverables: [
        'Dual EO/IR Thermal Night Tracking',
        'Tethered 12-Hour Continuous Hover',
        'Command Center Live Video Streaming',
        'Search & Rescue Emergency Dispatch'
      ],
      turnaround: 'Rapid emergency activation',
      tag: 'Public Safety & Defense'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Capabilities' },
    { id: 'media', label: 'Cinematography' },
    { id: 'gis', label: 'Surveying & LiDAR' },
    { id: 'agri', label: 'AgriTech' },
    { id: 'industrial', label: 'Industrial Inspection' }
  ];

  const filteredServices =
    activeCategory === 'all'
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <section id="services" style={{ padding: '5rem 0', position: 'relative' }}>
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid var(--border-accent)',
              color: 'var(--accent-cyan)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '1rem'
            }}
          >
            <Layers size={14} />
            ENTERPRISE AERIAL SOLUTIONS
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Mission-Critical <span className="gradient-text">Drone Services</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            DGCA-compliant commercial flight operations powered by advanced sensor payloads,
            dual-operator cinema rigs, and certified remote pilots.
          </p>

          {/* Filter Tabs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '2rem'
            }}
          >
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  background:
                    activeCategory === c.id
                      ? 'var(--accent-cyan)'
                      : 'rgba(255, 255, 255, 0.04)',
                  color: activeCategory === c.id ? '#070a13' : 'var(--text-secondary)',
                  border:
                    activeCategory === c.id
                      ? '1px solid var(--accent-cyan)'
                      : '1px solid var(--border-subtle)',
                  fontWeight: activeCategory === c.id ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <WeightTiltCard
                key={service.id}
                className="glass-card"
                maxTilt={14}
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '16px'
                }}
              >
                <div>
                  {/* Card top badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <div
                      style={{
                        width: '3.25rem',
                        height: '3.25rem',
                        borderRadius: '12px',
                        background: 'rgba(0, 242, 254, 0.1)',
                        border: '1px solid var(--border-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={24} color="var(--accent-cyan)" />
                    </div>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.3rem 0.7rem',
                        borderRadius: '9999px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--accent-emerald)',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      {service.badge}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--accent-cyan)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.35rem'
                    }}
                  >
                    {service.tag}
                  </div>

                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: '#fff' }}>
                    {service.title}
                  </h3>

                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.925rem',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem'
                    }}
                  >
                    {service.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '0.6rem'
                      }}
                    >
                      Key Deliverables:
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {service.deliverables.map((item, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          <Check size={14} color="var(--accent-cyan)" style={{ marginTop: '3px', flexShrink: 0 }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action footer */}
                <div
                  style={{
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {service.turnaround}
                  </span>

                  <button
                    onClick={() => onSelectService(service.title)}
                    className="btn btn-outline btn-sm"
                    style={{ gap: '0.35rem' }}
                  >
                    <span>Book Service</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </WeightTiltCard>
            );
          })}
        </div>

        {/* Custom Quote Banner with 3D Weight Tilt */}
        <WeightTiltCard
          className="glass-card"
          maxTilt={8}
          style={{
            marginTop: '3.5rem',
            padding: '2rem 2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            border: '1px solid var(--border-accent)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(0, 242, 254, 0.05))'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Sparkles size={18} color="var(--accent-cyan)" />
              <h4 style={{ fontSize: '1.2rem', color: '#fff' }}>Need Custom Sensor Payloads or Pilot Crews?</h4>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              We deploy custom heavy-lift multirotors and fixed-wing UAVs with DGCA-authorized operators nationwide.
            </p>
          </div>

          <button
            onClick={() => onSelectService('Custom Enterprise Fleet Operation')}
            className="btn btn-primary"
          >
            <span>Request Commercial Quotation</span>
            <ArrowRight size={16} />
          </button>
        </WeightTiltCard>
      </div>
    </section>
  );
};
