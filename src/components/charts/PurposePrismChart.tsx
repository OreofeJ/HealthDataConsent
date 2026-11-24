import { useMemo, useState } from 'react';
import { Consent, ConsentPurpose } from '../../types/consent';

interface PurposePrismChartProps {
  consents: Consent[];
}

interface PurposeGroupSummary {
  id: 'research' | 'ai' | 'commercial';
  label: string;
  shortLabel: string;
  purposes: ConsentPurpose[];
  description: string;
  count: number;
  percent: number;
  fillHex: string;
  bevelHex: string;
  barTrackHex: string;
  swatchClass: string;
}

export function PurposePrismChart({ consents }: PurposePrismChartProps) {
  const [selectedGroup, setSelectedGroup] = useState<PurposeGroupSummary['id'] | null>(null);

  const groups: PurposeGroupSummary[] = useMemo(() => {
    const total = consents.length;
    const researchPurposes: ConsentPurpose[] = [
      'Academic research',
      'Mental-health research',
      'Public-health research',
    ];
    const aiPurposes: ConsentPurpose[] = ['AI model development'];
    const dataCommercialPurposes: ConsentPurpose[] = [
      'Anonymous statistical analysis',
      'Commercial research',
    ];

    const countFor = (list: ConsentPurpose[]) =>
      consents.filter((c) => list.includes(c.purpose)).length;

    const researchCount = countFor(researchPurposes);
    const aiCount = countFor(aiPurposes);
    const commercialCount = countFor(dataCommercialPurposes);

    const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 1000) / 10);

    return [
      {
        id: 'research',
        label: 'Research',
        shortLabel: 'Research',
        purposes: researchPurposes,
        description: 'Academic, mental-health, and public-health research',
        count: researchCount,
        percent: pct(researchCount),
        fillHex: '#0B3B49',
        bevelHex: '#135365',
        barTrackHex: '#14B8A6',
        swatchClass: 'bg-[#0B3B49]',
      },
      {
        id: 'ai',
        label: 'AI Development',
        shortLabel: 'AI Development',
        purposes: aiPurposes,
        description: 'AI model development',
        count: aiCount,
        percent: pct(aiCount),
        fillHex: '#0F766E',
        bevelHex: '#148F85',
        barTrackHex: '#5EEAD4',
        swatchClass: 'bg-[#0F766E]',
      },
      {
        id: 'commercial',
        label: 'Data Analysis & Commercial Use',
        shortLabel: 'Analysis & Commercial',
        purposes: dataCommercialPurposes,
        description: 'Anonymous statistical analysis and commercial research',
        count: commercialCount,
        percent: pct(commercialCount),
        fillHex: '#1E3A5F',
        bevelHex: '#2B4E7C',
        barTrackHex: '#93C5FD',
        swatchClass: 'bg-[#1E3A5F]',
      },
    ];
  }, [consents]);

  const total = consents.length;
  const maxCount = Math.max(1, ...groups.map((g) => g.count));

  const research = groups[0];
  const ai = groups[1];
  const commercial = groups[2];

  const fillRatio = (count: number) => (total === 0 ? 0 : Math.max(0.08, count / maxCount));

  const isDimmed = (id: PurposeGroupSummary['id']) =>
    selectedGroup !== null && selectedGroup !== id;

  return (
    <section
      aria-labelledby="purpose-prism-title"
      className="rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="purpose-prism-title"
            className="font-display text-base font-semibold text-slate-900"
          >
            Consent Purpose Landscape
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Three-faced isometric prism representing consent counts across purpose groups.
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap">
          {total} records across 3 groups
        </span>
      </div>

      <div className="mt-5 grid items-center gap-6 lg:grid-cols-12">
        {/* Genuine 3D-inspired Exploded Isometric Triangular Prism SVG */}
        <div className="flex justify-center lg:col-span-7">
          <svg
            viewBox="0 0 540 318"
            className="w-full max-w-[540px]"
            role="img"
            aria-label={`Consent Purpose Landscape prism: Research ${research.count}, AI Development ${ai.count}, Data Analysis and Commercial Use ${commercial.count}`}
          >
            <defs>
              <linearGradient id="prismCoreGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#E2E8F0" />
              </linearGradient>
            </defs>

            {/* Central 3D Isometric Triangular Prism Core (shows triangular geometry) */}
            <g aria-hidden="true">
              {/* Isometric projection connector lines from core to the 3 exploded faces */}
              <line
                x1="175"
                y1="134"
                x2="175"
                y2="104"
                stroke="#CBD5E1"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <line
                x1="365"
                y1="134"
                x2="365"
                y2="104"
                stroke="#CBD5E1"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <line
                x1="175"
                y1="134"
                x2="112"
                y2="152"
                stroke="#CBD5E1"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <line
                x1="270"
                y1="184"
                x2="245"
                y2="218"
                stroke="#CBD5E1"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <line
                x1="270"
                y1="184"
                x2="295"
                y2="218"
                stroke="#CBD5E1"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <line
                x1="365"
                y1="134"
                x2="428"
                y2="152"
                stroke="#CBD5E1"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />

              {/* Central prism bottom triangle */}
              <polygon
                points="175,210 365,210 270,260"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="1.2"
              />
              {/* Central prism vertical edges */}
              <line x1="175" y1="134" x2="175" y2="210" stroke="#CBD5E1" strokeWidth="1.2" />
              <line x1="365" y1="134" x2="365" y2="210" stroke="#CBD5E1" strokeWidth="1.2" />
              <line x1="270" y1="184" x2="270" y2="260" stroke="#94A3B8" strokeWidth="1.3" />
              {/* Central prism top triangular cap */}
              <polygon
                points="175,134 365,134 270,184"
                fill="url(#prismCoreGrad)"
                stroke="#94A3B8"
                strokeWidth="1.4"
              />
            </g>

            {/* FACE 3 (Rear Rectangular Face): Data Analysis & Commercial Use */}
            <g
              className="cursor-pointer transition-opacity duration-200"
              style={{ opacity: isDimmed('commercial') ? 0.45 : 1 }}
              onMouseEnter={() => setSelectedGroup('commercial')}
              onMouseLeave={() => setSelectedGroup(null)}
            >
              {/* Top 3D bevel */}
              <polygon
                points="162,22 378,22 390,13 174,13"
                fill={commercial.bevelHex}
              />
              {/* Right 3D edge */}
              <polygon
                points="378,22 390,13 390,95 378,104"
                fill="#142944"
              />
              {/* Main rear rectangular face */}
              <rect
                x="162"
                y="22"
                width="216"
                height="82"
                rx="2"
                fill={commercial.fillHex}
                stroke="#3B5B87"
                strokeWidth="1"
              />
              <text
                x="176"
                y="45"
                className="fill-slate-200 text-[11px] font-medium"
              >
                Data Analysis &amp; Commercial Use
              </text>
              <text
                x="176"
                y="75"
                className="fill-white font-mono text-[22px] font-semibold tabular-nums"
              >
                {commercial.count}
              </text>
              <text
                x="222"
                y="74"
                className="fill-slate-300 font-mono text-[11px] tabular-nums"
              >
                consents ({commercial.percent.toFixed(1)}%)
              </text>
              {/* Proportional magnitude gauge inside face */}
              <rect
                x="176"
                y="87"
                width="188"
                height="5"
                rx="2.5"
                fill="rgba(255,255,255,0.16)"
              />
              <rect
                x="176"
                y="87"
                width={188 * fillRatio(commercial.count)}
                height="5"
                rx="2.5"
                fill={commercial.barTrackHex}
              />
            </g>

            {/* FACE 1 (Front-Left Rectangular Face): Research */}
            <g
              className="cursor-pointer transition-opacity duration-200"
              style={{ opacity: isDimmed('research') ? 0.45 : 1 }}
              onMouseEnter={() => setSelectedGroup('research')}
              onMouseLeave={() => setSelectedGroup(null)}
            >
              {/* Top 3D bevel */}
              <polygon
                points="94,142 246,218 256,210 104,134"
                fill={research.bevelHex}
              />
              {/* Left 3D edge */}
              <polygon
                points="94,142 104,134 104,222 94,230"
                fill="#072832"
              />
              {/* Main front-left isometric rectangular face (slope 76/152 = 0.5 -> 26.565 deg) */}
              <polygon
                points="94,142 246,218 246,306 94,230"
                fill={research.fillHex}
                stroke="#1E6275"
                strokeWidth="1"
              />
              <g transform="translate(107, 162) skewY(26.565)">
                <text x="0" y="14" className="fill-teal-100 text-[11.5px] font-medium">
                  Research
                </text>
                <text
                  x="0"
                  y="44"
                  className="fill-white font-mono text-[23px] font-semibold tabular-nums"
                >
                  {research.count}
                </text>
                <text
                  x="45"
                  y="43"
                  className="fill-teal-100/90 font-mono text-[10.5px] tabular-nums"
                >
                  ({research.percent.toFixed(1)}%)
                </text>
                <rect
                  x="0"
                  y="56"
                  width="124"
                  height="5"
                  rx="2.5"
                  fill="rgba(255,255,255,0.16)"
                />
                <rect
                  x="0"
                  y="56"
                  width={124 * fillRatio(research.count)}
                  height="5"
                  rx="2.5"
                  fill={research.barTrackHex}
                />
              </g>
            </g>

            {/* FACE 2 (Front-Right Rectangular Face): AI Development */}
            <g
              className="cursor-pointer transition-opacity duration-200"
              style={{ opacity: isDimmed('ai') ? 0.45 : 1 }}
              onMouseEnter={() => setSelectedGroup('ai')}
              onMouseLeave={() => setSelectedGroup(null)}
            >
              {/* Top 3D bevel */}
              <polygon
                points="294,218 446,142 436,134 284,210"
                fill={ai.bevelHex}
              />
              {/* Right 3D edge */}
              <polygon
                points="446,142 436,134 436,222 446,230"
                fill="#0A544E"
              />
              {/* Main front-right isometric rectangular face (slope -26.565 deg) */}
              <polygon
                points="294,218 446,142 446,230 294,306"
                fill={ai.fillHex}
                stroke="#20948B"
                strokeWidth="1"
              />
              <g transform="translate(308, 224) skewY(-26.565)">
                <text x="0" y="14" className="fill-teal-50 text-[11.5px] font-medium">
                  AI Development
                </text>
                <text
                  x="0"
                  y="44"
                  className="fill-white font-mono text-[23px] font-semibold tabular-nums"
                >
                  {ai.count}
                </text>
                <text
                  x="45"
                  y="43"
                  className="fill-teal-100/90 font-mono text-[10.5px] tabular-nums"
                >
                  ({ai.percent.toFixed(1)}%)
                </text>
                <rect
                  x="0"
                  y="56"
                  width="124"
                  height="5"
                  rx="2.5"
                  fill="rgba(255,255,255,0.18)"
                />
                <rect
                  x="0"
                  y="56"
                  width={124 * fillRatio(ai.count)}
                  height="5"
                  rx="2.5"
                  fill={ai.barTrackHex}
                />
              </g>
            </g>
          </svg>
        </div>

        {/* Explanatory Legend & Purpose Breakdown */}
        <div className="space-y-3 lg:col-span-5">
          {groups.map((group) => (
            <div
              key={group.id}
              onMouseEnter={() => setSelectedGroup(group.id)}
              onMouseLeave={() => setSelectedGroup(null)}
              className={`rounded-lg border p-3.5 transition-colors ${
                selectedGroup === group.id
                  ? 'border-teal-300 bg-teal-50/40'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`h-3 w-3 shrink-0 rounded-xs ${group.swatchClass}`}
                    aria-hidden="true"
                  />
                  <h3 className="text-sm font-semibold text-slate-900 truncate">
                    {group.label}
                  </h3>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                  {group.count} ({group.percent.toFixed(1)}%)
                </span>
              </div>

              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                Includes: {group.purposes.join(' · ')}
              </p>

              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${group.swatchClass}`}
                  style={{ width: total === 0 ? '0%' : `${(group.count / total) * 100}%` }}
                />
              </div>
            </div>
          ))}

          <p className="pt-1 text-[11px] leading-relaxed text-slate-500">
            Each prism face corresponds to a purpose group and shows its exact consent count
            and proportional fill bar; face dimensions are geometric rather than equal-share.
          </p>
        </div>
      </div>
    </section>
  );
}
