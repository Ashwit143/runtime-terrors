import React from 'react';

interface StatTileProps {
  label: string;
  value: string | number;
  detail?: string;
}

export function StatTile({ label, value, detail }: StatTileProps) {
  return (
    <div className="stat-tile">
      <div className="label-caps">{label}</div>
      <div className="stat-tile-val">{value}</div>
      {detail && <div className="stat-tile-detail">{detail}</div>}
    </div>
  );
}
